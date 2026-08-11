import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repositories: string[] = [];

async function run(cwd: string, command: string[], env?: Record<string, string>) {
  const child = Bun.spawn(command, {
    cwd,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { code, stdout: stdout.trim(), stderr: stderr.trim() };
}

async function git(cwd: string, ...args: string[]): Promise<string> {
  const result = await run(cwd, ["git", ...args]);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout;
}

afterEach(async () => {
  await Promise.all(
    repositories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("projected Stable baseline materialization", () => {
  test("code tree 위에 Stable Version 산출물만 적용해 preflight tree를 만든다", async () => {
    const repository = await mkdtemp(join(tmpdir(), "seed-projected-baseline-"));
    repositories.push(repository);
    await git(repository, "init", "-q");
    await git(repository, "config", "user.name", "test");
    await git(repository, "config", "user.email", "test@example.com");
    await writeFile(join(repository, "package.json"), '{"name":"fixture","version":"1.0.0"}\n');
    await writeFile(join(repository, "feature.txt"), "base\n");
    await git(repository, "add", ".");
    await git(repository, "commit", "-qm", "base");
    const stableBase = await git(repository, "rev-parse", "HEAD");

    await writeFile(join(repository, "package.json"), '{"name":"fixture","version":"1.1.0"}\n');
    await git(repository, "commit", "-qam", "stable version");
    const stableHead = await git(repository, "rev-parse", "HEAD");

    await git(repository, "switch", "-qc", "target", stableBase);
    await writeFile(join(repository, "feature.txt"), "promoted\n");
    await git(repository, "commit", "-qam", "promoted code");
    const codeHead = await git(repository, "rev-parse", "HEAD");
    const codeTree = await git(repository, "rev-parse", "HEAD^{tree}");
    const patch = await git(
      repository,
      "diff",
      "--binary",
      stableBase,
      stableHead,
      "--",
      "package.json",
    );
    const apply = Bun.spawn(["git", "apply", "--3way", "--index", "-"], {
      cwd: repository,
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    if (apply.stdin && typeof apply.stdin !== "number") {
      apply.stdin.write(`${patch}\n`);
      apply.stdin.end();
    }
    expect(await apply.exited).toBe(0);
    const expectedTree = await git(repository, "write-tree");
    await git(repository, "reset", "--hard", codeHead);
    await git(repository, "remote", "add", "origin", repository);

    const result = await run(
      repository,
      [
        "bun",
        join(
          process.cwd(),
          "tools/release-automation/src/promotion/materialize-projected-baseline.ts",
        ),
      ],
      {
        PROMOTION_CODE_HEAD_SHA: codeHead,
        PROMOTION_EXPECTED_CODE_TREE_SHA: codeTree,
        PROMOTION_STABLE_BASE_SHA: stableBase,
        PROMOTION_STABLE_HEAD_SHA: stableHead,
        PROMOTION_EXPECTED_BASELINE_TREE_SHA: expectedTree,
      },
    );
    expect(result.code).toBe(0);
    expect(await git(repository, "rev-parse", "HEAD^{tree}")).toBe(expectedTree);
    expect(await git(repository, "status", "--porcelain", "--untracked-files=all")).toBe("");
  });
});

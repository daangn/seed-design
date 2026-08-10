import { afterEach, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  parsePrereleaseWritePlan,
  verifyPrereleasePlanTree,
  type PrereleaseWritePlan,
} from "./prerelease-write-plan";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function git(repository: string, ...args: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd: repository,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${args.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function write(repository: string, path: string, value: unknown): Promise<void> {
  await mkdir(dirname(join(repository, path)), { recursive: true });
  await writeFile(
    join(repository, path),
    typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
  );
}

async function fixture(operation: "enter" | "exit") {
  const repository = await mkdtemp(join(tmpdir(), "seed-prerelease-plan-test-"));
  temporaryDirectories.push(repository);
  await git(repository, "init", "--initial-branch=minor");
  await git(repository, "config", "user.name", "Release Test");
  await git(repository, "config", "user.email", "release@example.com");
  await write(repository, "package.json", {
    name: "root",
    private: true,
    workspaces: ["packages/*"],
  });
  await write(repository, "packages/a/package.json", {
    name: "@seed-design/a",
    version: "1.2.3",
  });
  const active = {
    mode: "pre",
    tag: "beta",
    initialVersions: { "@seed-design/a": "1.2.3" },
    changesets: [],
  };
  if (operation === "exit") await write(repository, ".changeset/pre.json", active);
  await git(repository, "add", "-A");
  await git(repository, "commit", "-m", "base");
  const baseSha = await git(repository, "rev-parse", "HEAD");
  await write(
    repository,
    ".changeset/pre.json",
    operation === "enter" ? active : { ...active, mode: "exit" },
  );
  await git(repository, "add", "-A");
  await git(repository, "commit", "-m", operation);
  const headSha = await git(repository, "rev-parse", "HEAD");
  const treeSha = await git(repository, "rev-parse", `${headSha}^{tree}`);
  const patch = await git(
    repository,
    "diff",
    "--binary",
    "--full-index",
    "--no-ext-diff",
    baseSha,
    headSha,
    "--",
  );
  const plan: PrereleaseWritePlan = {
    schemaVersion: 1,
    kind: "prerelease",
    lane: "minor",
    operation,
    operationId: "123",
    baseSha,
    controlSha: "c".repeat(40),
    treeSha,
    patchSha256: createHash("sha256").update(`${patch}\n`).digest("hex"),
    files: [".changeset/pre.json"],
  };
  return { repository, plan, headSha };
}

describe("prerelease immutable write plan", () => {
  test.each([
    "enter",
    "exit",
  ] as const)("%s tree를 exact state-only diff로 재검증한다", async (operation) => {
    const { headSha, plan, repository } = await fixture(operation);
    await expect(verifyPrereleasePlanTree(repository, plan, headSha)).resolves.toBeUndefined();
  });

  test("plan schema의 extra key와 unsafe identity를 거부한다", async () => {
    const { plan } = await fixture("enter");
    expect(parsePrereleaseWritePlan(plan)).toEqual(plan);
    expect(() => parsePrereleaseWritePlan({ ...plan, extra: true })).toThrow("key");
    expect(() => parsePrereleaseWritePlan({ ...plan, lane: "dev" })).toThrow("minor/major");
    expect(() => parsePrereleaseWritePlan({ ...plan, operationId: "0" })).toThrow("operation ID");
  });

  test("tree SHA 또는 operation을 바꾸면 replay가 실패한다", async () => {
    const { headSha, plan, repository } = await fixture("enter");
    await expect(
      verifyPrereleasePlanTree(repository, { ...plan, treeSha: "f".repeat(40) }, headSha),
    ).rejects.toThrow("tree SHA");
    await expect(
      verifyPrereleasePlanTree(repository, { ...plan, operation: "exit" }, headSha),
    ).rejects.toThrow("active prerelease");
  });
});

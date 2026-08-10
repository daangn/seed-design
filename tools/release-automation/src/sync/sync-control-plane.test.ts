import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  applyControlPlaneOverlay,
  controlPlaneFingerprint,
  isControlPlanePath,
  isTrustedDevControlCommit,
} from "./sync-control-plane";

const temporaryDirectories: string[] = [];

async function git(cwd: string, ...arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function write(repository: string, path: string, content: string): Promise<void> {
  const absolutePath = join(repository, path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("trusted dev control-plane overlay", () => {
  test("privileged workflows/actions/release/Rootage 도구를 control-plane으로 분류한다", () => {
    expect(isControlPlanePath(".github/workflows/release-pr-validation.yml")).toBe(true);
    expect(isControlPlanePath(".github/workflows/release-publish.yml")).toBe(true);
    expect(isControlPlanePath(".github/workflows/rootage-release-contract.yml")).toBe(true);
    expect(isControlPlanePath(".github/actions/setup/action.yml")).toBe(true);
    expect(isControlPlanePath("tools/release-automation/src/sync/sync-worker.ts")).toBe(true);
    expect(isControlPlanePath("tools/rootage-cdn/src/publisher.ts")).toBe(true);
    expect(isControlPlanePath("scripts/notes/readme.md")).toBe(false);
    expect(isControlPlanePath("packages/react/src/index.ts")).toBe(false);
  });

  test("old target의 release control plane만 dev commit과 정확히 맞춘다", async () => {
    const repository = await mkdtemp(join(tmpdir(), "seed-sync-control-test-"));
    temporaryDirectories.push(repository);
    await git(repository, "init", "--initial-branch=target");
    await git(repository, "config", "user.name", "test");
    await git(repository, "config", "user.email", "test@example.com");
    await git(repository, "config", "commit.gpgsign", "false");
    await write(repository, ".github/workflows/release-pr-validation.yml", "old workflow\n");
    await write(repository, ".github/workflows/target-only.yml", "target-only workflow\n");
    await write(repository, ".github/actions/setup/action.yml", "old setup\n");
    await write(repository, "tools/release-automation/src/sync/old.ts", "old automation\n");
    await write(repository, "tools/rootage-cdn/src/old.ts", "old rootage tool\n");
    await write(repository, "package.txt", "target data\n");
    await git(repository, "add", "--all");
    await git(repository, "commit", "-m", "target base");
    const targetSha = await git(repository, "rev-parse", "HEAD");

    await git(repository, "switch", "-c", "dev");
    await write(repository, ".github/workflows/release-pr-validation.yml", "dispatch workflow\n");
    await rm(join(repository, ".github/workflows/target-only.yml"));
    await write(repository, ".github/actions/setup/action.yml", "new setup\n");
    await rm(join(repository, "tools/release-automation/src/sync/old.ts"));
    await write(repository, "tools/release-automation/src/sync/new.ts", "new automation\n");
    await rm(join(repository, "tools/rootage-cdn/src/old.ts"));
    await write(repository, "tools/rootage-cdn/src/new.ts", "new rootage tool\n");
    await write(repository, "package.txt", "dev data must not overlay\n");
    await git(repository, "add", "--all");
    await git(repository, "commit", "-m", "dev control plane");
    const controlSha = await git(repository, "rev-parse", "HEAD");
    await git(repository, "update-ref", "refs/remotes/origin/dev", controlSha);
    const fingerprint = await controlPlaneFingerprint(repository, controlSha);

    await git(repository, "switch", "--detach", targetSha);
    await applyControlPlaneOverlay(repository, controlSha);

    expect(await readFile(join(repository, "package.txt"), "utf8")).toBe("target data\n");
    expect(
      await readFile(join(repository, "tools/release-automation/src/sync/new.ts"), "utf8"),
    ).toBe("new automation\n");
    expect(
      await Bun.file(join(repository, "tools/release-automation/src/sync/old.ts")).exists(),
    ).toBe(false);
    expect(await Bun.file(join(repository, ".github/workflows/target-only.yml")).exists()).toBe(
      false,
    );
    expect(await readFile(join(repository, "tools/rootage-cdn/src/new.ts"), "utf8")).toBe(
      "new rootage tool\n",
    );
    expect(await Bun.file(join(repository, "tools/rootage-cdn/src/old.ts")).exists()).toBe(false);
    expect(await controlPlaneFingerprint(repository, controlSha)).toBe(fingerprint);
    expect(await isTrustedDevControlCommit(repository, controlSha)).toBe(true);
  });
});

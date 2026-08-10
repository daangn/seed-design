import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { verifyGeneratedPrProvenance } from "./generated-pr-provenance";
import type { ReleaseMarker } from "./types";

const temporaryDirectories: string[] = [];

async function git(cwd: string, ...arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], { cwd, stdout: "pipe", stderr: "pipe" });
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

describe("generated PR validation control-plane provenance", () => {
  test("exact head/current dev fingerprint를 결속하고 stale/control-plane 변경을 거부한다", async () => {
    const root = await mkdtemp(join(tmpdir(), "seed-generated-provenance-test-"));
    temporaryDirectories.push(root);
    const origin = join(root, "origin.git");
    const repository = join(root, "repository");
    await git(root, "init", "--bare", origin);
    await git(root, "init", "--initial-branch=dev", repository);
    await git(repository, "config", "user.name", "test");
    await git(repository, "config", "user.email", "test@example.com");
    await git(repository, "config", "commit.gpgsign", "false");
    await write(repository, ".github/workflows/release-pr-validation.yml", "dispatch\n");
    await write(repository, ".github/actions/setup/action.yml", "setup\n");
    await write(repository, "tools/release-automation/src/core/validator.ts", "current\n");
    await write(repository, "package.txt", "before\n");
    await git(repository, "add", "--all");
    await git(repository, "commit", "-m", "dev control");
    const controlSha = await git(repository, "rev-parse", "HEAD");
    await git(repository, "remote", "add", "origin", origin);
    await git(repository, "push", "-u", "origin", "dev");

    await git(repository, "switch", "-c", "changeset-release/dev");
    await write(repository, "package.txt", "after\n");
    await git(repository, "add", "package.txt");
    await git(repository, "commit", "-m", "version packages");
    const headSha = await git(repository, "rev-parse", "HEAD");
    const marker: ReleaseMarker = {
      schemaVersion: 1,
      type: "version",
      lane: "dev",
      expectedHeadSha: headSha,
      controlSha,
    };

    await expect(
      verifyGeneratedPrProvenance({
        marker,
        headSha,
        changedFiles: ["package.txt"],
        repositoryPath: repository,
      }),
    ).resolves.toMatchObject({ controlSha });
    await expect(
      verifyGeneratedPrProvenance({
        marker,
        headSha,
        changedFiles: ["tools/release-automation/src/core/validator.ts"],
        repositoryPath: repository,
      }),
    ).rejects.toThrow("version generated PR");

    await git(repository, "switch", "dev");
    await write(repository, "tools/release-automation/src/core/validator.ts", "newer\n");
    await git(repository, "add", "tools/release-automation/src/core/validator.ts");
    await git(repository, "commit", "-m", "advance control");
    await git(repository, "push", "origin", "dev");
    await expect(
      verifyGeneratedPrProvenance({
        marker,
        headSha,
        changedFiles: ["package.txt"],
        repositoryPath: repository,
      }),
    ).rejects.toThrow("현재 trusted dev control plane");
  });
});

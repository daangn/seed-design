import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { normalizeChangesetsInDirectory } from "./sync-changeset";
import { applyControlPlaneOverlay, controlPlaneFingerprint } from "./sync-control-plane";
import { verifyGeneratedSyncTree } from "./sync-tree";

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

describe("sync tree 재검증", () => {
  test("source diff와 protected file 복원을 재현하고 추가 변경을 거부한다", async () => {
    const root = await mkdtemp(join(tmpdir(), "seed-sync-tree-test-"));
    temporaryDirectories.push(root);
    const origin = join(root, "origin.git");
    const creator = join(root, "creator");
    const verifier = join(root, "verifier");
    const patchPath = join(root, "source.diff");

    await git(root, "init", "--bare", origin);
    await git(root, "init", "--initial-branch=main", creator);
    await git(creator, "config", "user.name", "github-actions[bot]");
    await git(creator, "config", "commit.gpgsign", "false");
    await git(
      creator,
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    );
    await write(creator, "package.txt", "before\n");
    await write(creator, ".changeset/config.json", '{"lane":"minor"}\n');
    await write(creator, ".changeset/pre.json", '{"mode":"pre"}\n');
    await write(creator, ".github/release/control.json", '{"mode":"production"}\n');
    await write(creator, ".github/release/lanes.json", '{"schemaVersion":1}\n');
    await write(creator, ".github/workflows/release-pr-validation.yml", "old validation\n");
    await write(creator, ".github/actions/setup/action.yml", "old setup\n");
    await write(creator, "tools/release-automation/src/sync/old.ts", "old automation\n");
    await git(creator, "add", "--all");
    await git(creator, "commit", "-m", "base");
    const baseSha = await git(creator, "rev-parse", "HEAD");

    await git(creator, "switch", "-c", "dev-control");
    await write(creator, ".github/workflows/release-pr-validation.yml", "dispatch validation\n");
    await write(creator, ".github/actions/setup/action.yml", "new setup\n");
    await rm(join(creator, "tools/release-automation/src/sync/old.ts"));
    await write(creator, "tools/release-automation/src/sync/new.ts", "new automation\n");
    await git(creator, "add", "--all");
    await git(creator, "commit", "-m", "dev control plane");
    const controlSha = await git(creator, "rev-parse", "HEAD");
    const controlTreeSha256 = await controlPlaneFingerprint(creator, controlSha);

    await git(creator, "switch", "--detach", baseSha);
    await git(creator, "switch", "-c", "source");
    await write(creator, "package.txt", "after\n");
    await write(creator, ".changeset/config.json", '{"lane":"dev"}\n');
    await write(creator, ".github/release/lanes.json", '{"schemaVersion":999}\n');
    await write(
      creator,
      ".changeset/feature.md",
      '---\n"@seed-design/react": patch\n---\n\n사용자 설명\n',
    );
    await git(creator, "add", "--all");
    await git(creator, "commit", "-m", "source change");
    const sourceDiff = await git(creator, "diff", "--binary", `${baseSha}..HEAD`);
    await writeFile(patchPath, `${sourceDiff}\n`);

    await git(creator, "switch", "--detach", baseSha);
    await git(creator, "apply", "--3way", "--whitespace=nowarn", patchPath);
    await git(
      creator,
      "restore",
      "--source=HEAD",
      "--staged",
      "--worktree",
      "--",
      ".changeset/config.json",
      ".changeset/pre.json",
      ".github/release/control.json",
      ".github/release/lanes.json",
    );
    await normalizeChangesetsInDirectory(creator, "minor");
    await applyControlPlaneOverlay(creator, controlSha);
    await git(creator, "add", "--all");
    await git(creator, "commit", "-m", "trusted sync");
    const trustedHead = await git(creator, "rev-parse", "HEAD");

    await git(creator, "remote", "add", "origin", origin);
    await git(creator, "push", "origin", "HEAD:refs/heads/trusted-sync");
    await git(creator, "push", "origin", `${controlSha}:refs/heads/dev`);
    await git(root, "clone", origin, verifier);

    expect(
      await verifyGeneratedSyncTree(
        verifier,
        trustedHead,
        baseSha,
        `${sourceDiff}\n`,
        "minor",
        controlSha,
        controlTreeSha256,
      ),
    ).toMatchObject({ matches: true });
    expect(
      await verifyGeneratedSyncTree(
        verifier,
        trustedHead,
        controlSha,
        `${sourceDiff}\n`,
        "minor",
        controlSha,
        controlTreeSha256,
      ),
    ).toMatchObject({ matches: false, reason: expect.stringContaining("현재 target base") });

    await git(creator, "switch", "--detach", baseSha);
    await git(creator, "apply", "--3way", "--whitespace=nowarn", patchPath);
    await git(
      creator,
      "restore",
      "--source=HEAD",
      "--staged",
      "--worktree",
      "--",
      ".changeset/config.json",
      ".changeset/pre.json",
      ".github/release/control.json",
      ".github/release/lanes.json",
    );
    await normalizeChangesetsInDirectory(creator, "minor");
    await applyControlPlaneOverlay(creator, controlSha);
    await write(creator, "tampered.txt", "human change\n");
    await git(creator, "add", "--all");
    await git(creator, "commit", "-m", "tampered sync");
    const tamperedHead = await git(creator, "rev-parse", "HEAD");
    await git(creator, "push", "origin", "HEAD:refs/heads/tampered-sync");

    expect(
      await verifyGeneratedSyncTree(
        verifier,
        tamperedHead,
        baseSha,
        `${sourceDiff}\n`,
        "minor",
        controlSha,
        controlTreeSha256,
      ),
    ).toMatchObject({ matches: false });

    await git(creator, "switch", "dev-control");
    await write(creator, "tools/release-automation/src/sync/new.ts", "newer automation\n");
    await git(creator, "add", "tools/release-automation/src/sync/new.ts");
    await git(creator, "commit", "-m", "advance dev control plane");
    await git(creator, "push", "origin", "HEAD:refs/heads/dev");
    expect(
      await verifyGeneratedSyncTree(
        verifier,
        trustedHead,
        baseSha,
        `${sourceDiff}\n`,
        "minor",
        controlSha,
        controlTreeSha256,
      ),
    ).toMatchObject({ matches: false, reason: expect.stringContaining("현재 dev control-plane") });
  });
});

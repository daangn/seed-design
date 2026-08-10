import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { protectedLaneFiles } from "./sync";
import { normalizeChangesetsInDirectory } from "./sync-changeset";
import {
  applyControlPlaneOverlay,
  controlPlaneFingerprint,
  isTrustedDevControlCommit,
} from "./sync-control-plane";
import type { BumpType } from "../core/types";

export interface SyncTreeVerification {
  matches: boolean;
  reason: string;
}

async function run(
  command: string[],
  options: { cwd: string; allowFailure?: boolean },
): Promise<{ code: number; output: string }> {
  const child = Bun.spawn(command, {
    cwd: options.cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const output = `${stdout}${stderr}`.trim();
  if (code !== 0 && !options.allowFailure) {
    throw new Error(`${command.join(" ")} 실패:\n${output}`);
  }
  return { code, output };
}

export async function verifyGeneratedSyncTree(
  repositoryPath: string,
  headSha: string,
  expectedBaseSha: string,
  sourceDiff: string,
  targetBump: BumpType,
  controlSha: string,
  expectedControlTreeSha256: string,
): Promise<SyncTreeVerification> {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "seed-release-sync-verify-"));
  const worktreePath = join(temporaryRoot, "worktree");
  const patchPath = join(temporaryRoot, "source.diff");
  let worktreeAdded = false;

  try {
    await Bun.write(patchPath, sourceDiff);
    await run(["git", "fetch", "--no-tags", "origin", headSha], { cwd: repositoryPath });
    await run(["git", "fetch", "--no-tags", "origin", "+refs/heads/dev:refs/remotes/origin/dev"], {
      cwd: repositoryPath,
    });
    if (!(await isTrustedDevControlCommit(repositoryPath, controlSha))) {
      return { matches: false, reason: "control-plane commit이 trusted dev 이력이 아닙니다." };
    }
    if ((await controlPlaneFingerprint(repositoryPath, controlSha)) !== expectedControlTreeSha256) {
      return { matches: false, reason: "control-plane tree hash가 marker와 다릅니다." };
    }
    if (
      (await controlPlaneFingerprint(repositoryPath, "origin/dev")) !== expectedControlTreeSha256
    ) {
      return { matches: false, reason: "현재 dev control-plane tree가 marker 이후 변경됐습니다." };
    }
    const commit = (
      await run(["git", "rev-list", "--parents", "-n", "1", headSha], {
        cwd: repositoryPath,
      })
    ).output
      .split(/\s+/)
      .filter(Boolean);
    const [resolvedHead, ...parents] = commit;
    if (
      resolvedHead !== headSha ||
      parents.length !== 1 ||
      !parents[0] ||
      parents[0] !== expectedBaseSha
    ) {
      return {
        matches: false,
        reason: "sync head가 현재 target base에 직접 연결된 단일 parent commit이 아닙니다.",
      };
    }

    await run(["git", "worktree", "add", "--detach", worktreePath, parents[0]], {
      cwd: repositoryPath,
    });
    worktreeAdded = true;
    const applied = await run(["git", "apply", "--3way", "--whitespace=nowarn", patchPath], {
      cwd: worktreePath,
      allowFailure: true,
    });
    if (applied.code !== 0) {
      return {
        matches: false,
        reason: "기록된 source diff를 sync head parent에 다시 적용할 수 없습니다.",
      };
    }

    for (const file of protectedLaneFiles) {
      await run(["git", "restore", "--source=HEAD", "--staged", "--worktree", "--", file], {
        cwd: worktreePath,
        allowFailure: true,
      });
    }
    await normalizeChangesetsInDirectory(worktreePath, targetBump);
    await applyControlPlaneOverlay(worktreePath, controlSha);
    await run(["git", "add", "--all"], { cwd: worktreePath });
    const expectedTree = (await run(["git", "write-tree"], { cwd: worktreePath })).output;
    const actualTree = (
      await run(["git", "show", "-s", "--format=%T", headSha], { cwd: repositoryPath })
    ).output;
    return expectedTree === actualTree
      ? { matches: true, reason: "source diff에서 재구성한 tree와 일치합니다." }
      : { matches: false, reason: "source diff에서 재구성한 tree와 sync head tree가 다릅니다." };
  } finally {
    if (worktreeAdded) {
      await run(["git", "worktree", "remove", "--force", worktreePath], {
        cwd: repositoryPath,
        allowFailure: true,
      });
    }
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

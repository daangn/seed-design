import {
  controlPlaneFingerprint,
  isControlPlanePath,
  isTrustedDevControlCommit,
} from "../sync/sync-control-plane";
import { isControlShaMarker } from "../sync/sync-policy";
import type { ReleaseMarker } from "./types";

export interface GeneratedPrProvenanceInput {
  marker: ReleaseMarker;
  headSha: string;
  changedFiles: string[];
  repositoryPath?: string;
}

export interface GeneratedPrProvenance {
  controlSha: string;
  controlTreeSha256: string;
}

async function git(repositoryPath: string, arguments_: string[]): Promise<void> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
}

export async function verifyGeneratedPrProvenance(
  input: GeneratedPrProvenanceInput,
): Promise<GeneratedPrProvenance> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  if (!/^[0-9a-f]{40}$/.test(input.headSha) || input.marker.expectedHeadSha !== input.headSha) {
    throw new Error("generated PR marker가 현재 exact head SHA에 결속되지 않았습니다.");
  }
  if (!isControlShaMarker(input.marker)) {
    throw new Error("generated PR marker에 trusted dev control SHA가 없습니다.");
  }
  const changedControlPlaneFiles = input.changedFiles.filter(isControlPlanePath);
  const canRestoreControlPlane = input.marker.type === "sync";
  if (!canRestoreControlPlane && changedControlPlaneFiles.length > 0) {
    throw new Error(
      `${input.marker.type} generated PR은 validation control plane을 변경할 수 없습니다: ${changedControlPlaneFiles.join(", ")}`,
    );
  }

  await git(repositoryPath, [
    "fetch",
    "--no-tags",
    "origin",
    "+refs/heads/dev:refs/remotes/origin/dev",
  ]);
  if (!(await isTrustedDevControlCommit(repositoryPath, input.marker.controlSha))) {
    throw new Error("marker의 control-plane commit이 trusted dev 이력이 아닙니다.");
  }
  const [currentControlTree, recordedControlTree, headControlTree] = await Promise.all([
    controlPlaneFingerprint(repositoryPath, "origin/dev"),
    controlPlaneFingerprint(repositoryPath, input.marker.controlSha),
    controlPlaneFingerprint(repositoryPath, input.headSha),
  ]);
  if (
    recordedControlTree !== currentControlTree ||
    headControlTree !== currentControlTree ||
    (input.marker.controlTreeSha256 !== undefined &&
      input.marker.controlTreeSha256 !== currentControlTree)
  ) {
    throw new Error(
      "PR head/marker의 validation control plane이 현재 trusted dev control plane과 다릅니다.",
    );
  }
  return {
    controlSha: input.marker.controlSha,
    controlTreeSha256: currentControlTree,
  };
}

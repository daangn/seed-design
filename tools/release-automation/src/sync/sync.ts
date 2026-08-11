import { createHash } from "node:crypto";
import { rm } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import type { LaneConfig, LaneName, ReleaseMarker, SyncCandidate } from "../core/types";

export function syncTargets(config: LaneConfig, source: LaneName): LaneName[] {
  return Object.entries(config.lanes)
    .filter(([, definition]) => definition.sources.includes(source))
    .map(([lane]) => lane as LaneName);
}

export function idempotencyKey(repository: string, sourcePr: number, targetLane: LaneName): string {
  return `${repository}#${sourcePr}->${targetLane}`;
}

export function sortSyncCandidates(candidates: SyncCandidate[]): SyncCandidate[] {
  return [...candidates].sort((left, right) => {
    const byDate = left.mergedAt.localeCompare(right.mergedAt);
    return byDate === 0 ? left.number - right.number : byDate;
  });
}

export function sha256(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function removeSyncRejectFiles(
  repositoryPath: string,
  files: string[],
): Promise<void> {
  const root = resolve(repositoryPath);
  await Promise.all(
    files.map((file) => {
      const path = resolve(root, file);
      const pathFromRoot = relative(root, path);
      if (!pathFromRoot || pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
        throw new Error(`sync reject 경로가 target worktree 밖을 가리킵니다: ${file}`);
      }
      return rm(path, { force: true });
    }),
  );
}

export function isProcessed(
  marker: ReleaseMarker,
  repository: string,
  sourcePr: number,
  targetLane: LaneName,
): boolean {
  return (
    marker.type === "sync" &&
    marker.sourceRepository === repository &&
    marker.sourcePr === sourcePr &&
    marker.targetLane === targetLane
  );
}

export const protectedLaneFiles = [
  ".changeset/config.json",
  ".changeset/pre.json",
  ".github/release/control.json",
  ".github/release/lanes.json",
] as const;

import { createHash } from "node:crypto";
import type { LaneConfig, LaneName, ReleaseMarker, SyncCandidate } from "./types";

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
] as const;

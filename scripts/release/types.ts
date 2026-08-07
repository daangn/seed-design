export const laneNames = ["dev", "minor", "major"] as const;
export const bumpTypes = ["patch", "minor", "major"] as const;
export const generatedPrTypes = [
  "version",
  "transition",
  "sync",
  "freeze",
  "integration",
  "rebuild",
] as const;

export type LaneName = (typeof laneNames)[number];
export type BumpType = (typeof bumpTypes)[number];
export type GeneratedPrType = (typeof generatedPrTypes)[number];
export type TransitionCommand = "enter" | "retag" | "exit";

export interface LaneDefinition {
  bump: BumpType;
  prerelease: boolean;
  sources: LaneName[];
}

export interface LaneConfig {
  $schema: "./lanes.schema.json";
  schemaVersion: 1;
  repository: string;
  maintainerTeam: string;
  protectedDistTags: string[];
  lanes: Record<LaneName, LaneDefinition>;
  sync: {
    activation: string | null;
    reconcileCron: string;
    conflictAlertHours: number;
  };
}

export interface ReleaseFreeze {
  promotionLane: Exclude<LaneName, "dev">;
  candidateSha: string;
  phase: "frozen" | "integrating" | "rebuilding";
  frozenLanes: Exclude<LaneName, "dev">[];
  startedAt: string;
}

export interface ReleaseControl {
  $schema: "./control.schema.json";
  schemaVersion: 1;
  mode: "dry-run" | "production";
  rootageContractReady: boolean;
  freeze: ReleaseFreeze | null;
}

export interface ReleaseMarker {
  schemaVersion: 1;
  type: GeneratedPrType;
  lane: LaneName;
  sourceRepository?: string;
  sourcePr?: number;
  targetLane?: LaneName;
  patchSha256?: string;
  expectedHeadSha?: string;
  command?: TransitionCommand;
  tag?: string;
}

export interface PullRequestIdentity {
  author: string;
  body: string;
  baseRef: string;
  headRef: string;
  baseRepository: string;
  headRepository: string;
}

export interface ChangesetEntry {
  file: string;
  releases: Array<{ name: string; type: BumpType }>;
}

export interface SyncCandidate {
  number: number;
  mergedAt: string;
  baseRef: LaneName;
  mergeCommitSha: string;
  author: string;
}

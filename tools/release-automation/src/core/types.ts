export const laneNames = ["dev", "minor", "major"] as const;
export const bumpTypes = ["patch", "minor", "major"] as const;
export const generatedPrTypes = ["version", "sync", "activation", "bootstrap"] as const;
export const activationOperations = [
  "enable-rootage-contract",
  "enable-sync",
  "enable-dry-run",
  "enable-production",
] as const;

export type LaneName = (typeof laneNames)[number];
export type BumpType = (typeof bumpTypes)[number];
export type GeneratedPrType = (typeof generatedPrTypes)[number];
export type ActivationOperation = (typeof activationOperations)[number];

export function isActivationOperation(value: unknown): value is ActivationOperation {
  return typeof value === "string" && (activationOperations as readonly string[]).includes(value);
}

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

export interface ReleaseControl {
  $schema: "./control.schema.json";
  schemaVersion: 1;
  mode: "dry-run" | "production";
  rootageContractReady: boolean;
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
  targetBump?: BumpType;
  controlSha?: string;
  controlTreeSha256?: string;
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

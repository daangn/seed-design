import type {
  GeneratedPrType,
  PromotionTargetPlan,
  PullRequestIdentity,
  ReleaseMarker,
  VersionReleaseKind,
} from "./types";
import {
  generatedPrTypes,
  isActivationOperation,
  isPrereleaseOperation,
  laneNames,
  versionReleaseKinds,
} from "./types";

const markerPattern = /<!-- seed-release:(\{[^\n]+\}) -->/;
const runIdPattern = /^[1-9][0-9]*$/;
const gitShaPattern = /^[0-9a-f]{40}$/;

const prereleaseMarkerKeys = [
  "controlSha",
  "expectedBaseSha",
  "expectedHeadSha",
  "lane",
  "operation",
  "operationId",
  "patchSha256",
  "schemaVersion",
  "type",
] as const;
const exitPrereleaseMarkerKeys = [...prereleaseMarkerKeys, "enterMergeSha", "enterPr"] as const;
const stablePromotionMarkerKeys = [
  "controlSha",
  "enterMergeSha",
  "enterPr",
  "exitBaseSha",
  "exitMergeSha",
  "exitPr",
  "expectedBaseSha",
  "expectedHeadSha",
  "lane",
  "operationId",
  "promotionManifestSha256",
  "promotionTargets",
  "releaseKind",
  "schemaVersion",
  "stablePatchSha256",
  "type",
] as const;
const baselineMarkerKeys = [
  "codeMergeSha",
  "controlSha",
  "expectedBaseSha",
  "expectedBaselineTreeSha",
  "expectedCodeTreeSha",
  "expectedHeadSha",
  "lane",
  "promotionManifestSha256",
  "publishRunId",
  "schemaVersion",
  "stableMergeSha",
  "stablePatchSha256",
  "stablePr",
  "type",
  "versionsSha256",
] as const;
const codePromotionMarkerKeys = [
  "controlSha",
  "controlTreeSha256",
  "enterMergeSha",
  "enterPr",
  "exitBaseSha",
  "exitMergeSha",
  "exitPr",
  "expectedBaseSha",
  "expectedBaselineTreeSha",
  "expectedCodeTreeSha",
  "expectedHeadSha",
  "lane",
  "patchSha256",
  "promotionManifestSha256",
  "schemaVersion",
  "sourceLane",
  "stablePatchSha256",
  "stablePr",
  "stableVersionHeadSha",
  "type",
] as const;
const legacyNormalizationMarkerKeys = [
  "controlSha",
  "expectedBaseSha",
  "expectedHeadSha",
  "expectedPreSha256",
  "lane",
  "operationId",
  "patchSha256",
  "schemaVersion",
  "sourceRepository",
  "type",
] as const;
const promotionTargetKeys = [
  "expectedBaseSha",
  "expectedBaselineTreeSha",
  "expectedCodeTreeSha",
  "expectedHeadSha",
  "lane",
  "noOp",
  "patchSha256",
] as const;

const sha256Pattern = /^[0-9a-f]{64}$/;
const emptySha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function hasExactKeys(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

type PrereleaseMarkerBase = ReleaseMarker & {
  type: "prerelease";
  lane: "minor" | "major";
  operation: "enter" | "exit";
  operationId: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  controlSha: string;
  patchSha256: string;
};

export type PrereleaseMarker =
  | (PrereleaseMarkerBase & {
      operation: "enter";
      enterPr?: never;
      enterMergeSha?: never;
    })
  | (PrereleaseMarkerBase & {
      operation: "exit";
      enterPr: number;
      enterMergeSha: string;
    });

export type StablePromotionMarker = ReleaseMarker & {
  type: "version";
  lane: "minor" | "major";
  releaseKind: "stable-promotion";
  operationId: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  controlSha: string;
  exitPr: number;
  exitBaseSha: string;
  exitMergeSha: string;
  enterPr: number;
  enterMergeSha: string;
  promotionManifestSha256: string;
  stablePatchSha256: string;
  promotionTargets: PromotionTargetPlan[];
};

export type CodePromotionMarker = ReleaseMarker & {
  type: "code-promotion";
  lane: "dev" | "minor" | "major";
  sourceLane: "minor" | "major";
  stablePr: number;
  stableVersionHeadSha: string;
  enterPr: number;
  enterMergeSha: string;
  exitPr: number;
  exitBaseSha: string;
  exitMergeSha: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  expectedCodeTreeSha: string;
  expectedBaselineTreeSha: string;
  promotionManifestSha256: string;
  patchSha256: string;
  stablePatchSha256: string;
  controlSha: string;
  controlTreeSha256: string;
};

export type BaselineMarker = ReleaseMarker & {
  type: "baseline";
  lane: "dev" | "minor" | "major";
  stablePr: number;
  stableMergeSha: string;
  publishRunId: number;
  expectedBaseSha: string;
  expectedHeadSha: string;
  codeMergeSha: string;
  expectedCodeTreeSha: string;
  expectedBaselineTreeSha: string;
  promotionManifestSha256: string;
  stablePatchSha256: string;
  controlSha: string;
  versionsSha256: string;
};

export type LegacyNormalizationMarker = ReleaseMarker & {
  type: "legacy-normalization";
  lane: "minor" | "major";
  operationId: string;
  sourceRepository: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  expectedPreSha256: string;
  patchSha256: string;
  controlSha: string;
};

export function isLegacyNormalizationMarker(
  marker: ReleaseMarker,
): marker is LegacyNormalizationMarker {
  return (
    marker.type === "legacy-normalization" &&
    (marker.lane === "minor" || marker.lane === "major") &&
    typeof marker.operationId === "string" &&
    runIdPattern.test(marker.operationId) &&
    typeof marker.sourceRepository === "string" &&
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(marker.sourceRepository) &&
    typeof marker.expectedBaseSha === "string" &&
    gitShaPattern.test(marker.expectedBaseSha) &&
    typeof marker.expectedHeadSha === "string" &&
    gitShaPattern.test(marker.expectedHeadSha) &&
    marker.expectedHeadSha !== marker.expectedBaseSha &&
    typeof marker.expectedPreSha256 === "string" &&
    sha256Pattern.test(marker.expectedPreSha256) &&
    typeof marker.patchSha256 === "string" &&
    sha256Pattern.test(marker.patchSha256) &&
    typeof marker.controlSha === "string" &&
    gitShaPattern.test(marker.controlSha)
  );
}

export function isBaselineMarker(marker: ReleaseMarker): marker is BaselineMarker {
  return (
    marker.type === "baseline" &&
    (marker.lane === "dev" || marker.lane === "minor" || marker.lane === "major") &&
    Number.isSafeInteger(marker.stablePr) &&
    Number(marker.stablePr) > 0 &&
    typeof marker.stableMergeSha === "string" &&
    gitShaPattern.test(marker.stableMergeSha) &&
    Number.isSafeInteger(marker.publishRunId) &&
    Number(marker.publishRunId) > 0 &&
    typeof marker.expectedBaseSha === "string" &&
    gitShaPattern.test(marker.expectedBaseSha) &&
    typeof marker.expectedHeadSha === "string" &&
    gitShaPattern.test(marker.expectedHeadSha) &&
    typeof marker.codeMergeSha === "string" &&
    gitShaPattern.test(marker.codeMergeSha) &&
    marker.codeMergeSha === marker.expectedBaseSha &&
    typeof marker.expectedCodeTreeSha === "string" &&
    gitShaPattern.test(marker.expectedCodeTreeSha) &&
    typeof marker.expectedBaselineTreeSha === "string" &&
    gitShaPattern.test(marker.expectedBaselineTreeSha) &&
    typeof marker.promotionManifestSha256 === "string" &&
    sha256Pattern.test(marker.promotionManifestSha256) &&
    typeof marker.stablePatchSha256 === "string" &&
    sha256Pattern.test(marker.stablePatchSha256) &&
    typeof marker.controlSha === "string" &&
    gitShaPattern.test(marker.controlSha) &&
    typeof marker.versionsSha256 === "string" &&
    /^[0-9a-f]{64}$/.test(marker.versionsSha256)
  );
}

export function isPrereleaseMarker(marker: ReleaseMarker): marker is PrereleaseMarker {
  return (
    marker.type === "prerelease" &&
    (marker.lane === "minor" || marker.lane === "major") &&
    isPrereleaseOperation(marker.operation) &&
    typeof marker.operationId === "string" &&
    runIdPattern.test(marker.operationId) &&
    typeof marker.expectedBaseSha === "string" &&
    gitShaPattern.test(marker.expectedBaseSha) &&
    typeof marker.expectedHeadSha === "string" &&
    gitShaPattern.test(marker.expectedHeadSha) &&
    typeof marker.controlSha === "string" &&
    gitShaPattern.test(marker.controlSha) &&
    typeof marker.patchSha256 === "string" &&
    sha256Pattern.test(marker.patchSha256) &&
    (marker.operation === "enter" ||
      (Number.isSafeInteger(marker.enterPr) &&
        Number(marker.enterPr) > 0 &&
        typeof marker.enterMergeSha === "string" &&
        gitShaPattern.test(marker.enterMergeSha)))
  );
}

function isPromotionTargetPlan(value: unknown): value is PromotionTargetPlan {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const target = value as Partial<PromotionTargetPlan>;
  return (
    hasExactKeys(value, promotionTargetKeys) &&
    (target.lane === "dev" || target.lane === "minor" || target.lane === "major") &&
    typeof target.expectedBaseSha === "string" &&
    gitShaPattern.test(target.expectedBaseSha) &&
    typeof target.expectedHeadSha === "string" &&
    gitShaPattern.test(target.expectedHeadSha) &&
    typeof target.expectedCodeTreeSha === "string" &&
    gitShaPattern.test(target.expectedCodeTreeSha) &&
    typeof target.expectedBaselineTreeSha === "string" &&
    gitShaPattern.test(target.expectedBaselineTreeSha) &&
    typeof target.patchSha256 === "string" &&
    sha256Pattern.test(target.patchSha256) &&
    typeof target.noOp === "boolean" &&
    (target.noOp
      ? target.expectedHeadSha === target.expectedBaseSha && target.patchSha256 === emptySha256
      : target.expectedHeadSha !== target.expectedBaseSha)
  );
}

export function isStablePromotionMarker(marker: ReleaseMarker): marker is StablePromotionMarker {
  return (
    marker.type === "version" &&
    (marker.lane === "minor" || marker.lane === "major") &&
    marker.releaseKind === "stable-promotion" &&
    typeof marker.operationId === "string" &&
    runIdPattern.test(marker.operationId) &&
    typeof marker.expectedBaseSha === "string" &&
    gitShaPattern.test(marker.expectedBaseSha) &&
    typeof marker.expectedHeadSha === "string" &&
    gitShaPattern.test(marker.expectedHeadSha) &&
    typeof marker.controlSha === "string" &&
    gitShaPattern.test(marker.controlSha) &&
    Number.isSafeInteger(marker.exitPr) &&
    Number(marker.exitPr) > 0 &&
    typeof marker.exitBaseSha === "string" &&
    gitShaPattern.test(marker.exitBaseSha) &&
    typeof marker.exitMergeSha === "string" &&
    gitShaPattern.test(marker.exitMergeSha) &&
    marker.expectedBaseSha === marker.exitMergeSha &&
    Number.isSafeInteger(marker.enterPr) &&
    Number(marker.enterPr) > 0 &&
    typeof marker.enterMergeSha === "string" &&
    gitShaPattern.test(marker.enterMergeSha) &&
    typeof marker.promotionManifestSha256 === "string" &&
    sha256Pattern.test(marker.promotionManifestSha256) &&
    typeof marker.stablePatchSha256 === "string" &&
    sha256Pattern.test(marker.stablePatchSha256) &&
    Array.isArray(marker.promotionTargets) &&
    marker.promotionTargets.length === 2 &&
    marker.promotionTargets.every(isPromotionTargetPlan) &&
    marker.promotionTargets[0]?.lane === "dev" &&
    marker.promotionTargets[1]?.lane === (marker.lane === "minor" ? "major" : "minor")
  );
}

export function isCodePromotionMarker(marker: ReleaseMarker): marker is CodePromotionMarker {
  const targetAllowed =
    marker.sourceLane === "minor"
      ? marker.lane === "dev" || marker.lane === "major"
      : marker.sourceLane === "major"
        ? marker.lane === "dev" || marker.lane === "minor"
        : false;
  return (
    marker.type === "code-promotion" &&
    targetAllowed &&
    Number.isSafeInteger(marker.stablePr) &&
    Number(marker.stablePr) > 0 &&
    typeof marker.stableVersionHeadSha === "string" &&
    gitShaPattern.test(marker.stableVersionHeadSha) &&
    Number.isSafeInteger(marker.enterPr) &&
    Number(marker.enterPr) > 0 &&
    typeof marker.enterMergeSha === "string" &&
    gitShaPattern.test(marker.enterMergeSha) &&
    Number.isSafeInteger(marker.exitPr) &&
    Number(marker.exitPr) > 0 &&
    typeof marker.exitBaseSha === "string" &&
    gitShaPattern.test(marker.exitBaseSha) &&
    typeof marker.exitMergeSha === "string" &&
    gitShaPattern.test(marker.exitMergeSha) &&
    typeof marker.expectedBaseSha === "string" &&
    gitShaPattern.test(marker.expectedBaseSha) &&
    typeof marker.expectedHeadSha === "string" &&
    gitShaPattern.test(marker.expectedHeadSha) &&
    marker.expectedHeadSha !== marker.expectedBaseSha &&
    typeof marker.expectedCodeTreeSha === "string" &&
    gitShaPattern.test(marker.expectedCodeTreeSha) &&
    typeof marker.expectedBaselineTreeSha === "string" &&
    gitShaPattern.test(marker.expectedBaselineTreeSha) &&
    typeof marker.promotionManifestSha256 === "string" &&
    sha256Pattern.test(marker.promotionManifestSha256) &&
    typeof marker.patchSha256 === "string" &&
    sha256Pattern.test(marker.patchSha256) &&
    marker.patchSha256 !== emptySha256 &&
    typeof marker.stablePatchSha256 === "string" &&
    sha256Pattern.test(marker.stablePatchSha256) &&
    typeof marker.controlSha === "string" &&
    gitShaPattern.test(marker.controlSha) &&
    typeof marker.controlTreeSha256 === "string" &&
    sha256Pattern.test(marker.controlTreeSha256)
  );
}

function hasRunIdSuffix(headRef: string, prefix: string): boolean {
  return headRef.startsWith(prefix) && runIdPattern.test(headRef.slice(prefix.length));
}

export function hasExpectedGeneratedHeadRef(headRef: string, marker: ReleaseMarker): boolean {
  if (marker.type === "version") return headRef === `changeset-release/${marker.lane}`;

  if (marker.type === "prerelease") {
    return (
      isPrereleaseMarker(marker) &&
      headRef === `release-prerelease/${marker.lane}/${marker.operation}-${marker.operationId}`
    );
  }

  if (marker.type === "baseline") {
    return (
      isBaselineMarker(marker) &&
      headRef ===
        `release-baseline/${marker.lane}/${marker.stableMergeSha.slice(0, 12)}-${marker.publishRunId}`
    );
  }

  if (marker.type === "code-promotion") {
    return (
      isCodePromotionMarker(marker) &&
      headRef ===
        `release-code-promotion/${marker.lane}/${marker.stablePr}-${marker.promotionManifestSha256.slice(0, 12)}`
    );
  }

  if (marker.type === "legacy-normalization") {
    return (
      isLegacyNormalizationMarker(marker) &&
      headRef === `release-legacy-normalization/${marker.lane}-${marker.operationId}`
    );
  }

  if (marker.type === "sync") {
    if (
      marker.targetLane !== marker.lane ||
      !Number.isSafeInteger(marker.sourcePr) ||
      Number(marker.sourcePr) <= 0
    ) {
      return false;
    }
    return laneNames.some((sourceLane) => {
      const base = `release-sync/${sourceLane}-${marker.sourcePr}-to-${marker.lane}`;
      if (headRef === base) return true;
      if (!headRef.startsWith(`${base}-attempt-`)) return false;
      const attempt = headRef.slice(`${base}-attempt-`.length);
      return /^(?:[2-9]|[1-9][0-9]+)$/.test(attempt);
    });
  }

  if (marker.type === "activation") {
    return (
      marker.lane === "dev" &&
      marker.targetLane === undefined &&
      isActivationOperation(marker.tag) &&
      hasRunIdSuffix(headRef, `release-activation/${marker.tag}-`)
    );
  }

  if (marker.type === "bootstrap") {
    return (
      (marker.lane === "minor" || marker.lane === "major") &&
      marker.targetLane === marker.lane &&
      marker.tag === "beta" &&
      hasRunIdSuffix(headRef, `release-bootstrap/${marker.lane}-`)
    );
  }

  return false;
}

export function encodeMarker(marker: ReleaseMarker): string {
  return `<!-- seed-release:${JSON.stringify(marker)} -->`;
}

export function parseMarker(body: string): ReleaseMarker | null {
  const match = body.match(markerPattern);
  if (!match?.[1]) return null;

  try {
    const marker = JSON.parse(match[1]) as Partial<ReleaseMarker>;
    if (
      marker.schemaVersion !== 1 ||
      !generatedPrTypes.includes(marker.type as GeneratedPrType) ||
      !laneNames.includes(marker.lane as ReleaseMarker["lane"])
    ) {
      return null;
    }
    const parsed = marker as ReleaseMarker;
    if (
      parsed.type === "prerelease" &&
      (!hasExactKeys(
        parsed,
        parsed.operation === "exit" ? exitPrereleaseMarkerKeys : prereleaseMarkerKeys,
      ) ||
        !isPrereleaseMarker(parsed))
    ) {
      return null;
    }
    if (parsed.type === "version" && parsed.releaseKind !== undefined) {
      if (
        !versionReleaseKinds.includes(parsed.releaseKind as VersionReleaseKind) ||
        !hasExactKeys(parsed, stablePromotionMarkerKeys) ||
        !isStablePromotionMarker(parsed)
      ) {
        return null;
      }
    }
    if (
      parsed.type === "baseline" &&
      (!hasExactKeys(parsed, baselineMarkerKeys) || !isBaselineMarker(parsed))
    ) {
      return null;
    }
    if (
      parsed.type === "code-promotion" &&
      (!hasExactKeys(parsed, codePromotionMarkerKeys) || !isCodePromotionMarker(parsed))
    ) {
      return null;
    }
    if (
      parsed.type === "legacy-normalization" &&
      (!hasExactKeys(parsed, legacyNormalizationMarkerKeys) || !isLegacyNormalizationMarker(parsed))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function validateGeneratedPr(identity: PullRequestIdentity): ReleaseMarker | null {
  if (identity.author !== "github-actions[bot]") return null;
  if (identity.headRepository !== identity.baseRepository) return null;

  const marker = parseMarker(identity.body);
  if (!marker) {
    if (identity.body.includes("<!-- seed-release:")) return null;
    const lane = laneNames.find((candidate) => candidate === identity.baseRef);
    if (!lane || identity.headRef !== `changeset-release/${lane}`) return null;
    return {
      schemaVersion: 1,
      type: "version",
      lane,
    };
  }

  if (identity.baseRef !== marker.lane) return null;
  if (
    marker.type === "legacy-normalization" &&
    marker.sourceRepository !== identity.baseRepository
  ) {
    return null;
  }
  if (!hasExpectedGeneratedHeadRef(identity.headRef, marker)) return null;
  return marker;
}

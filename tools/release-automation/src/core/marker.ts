import type {
  GeneratedPrType,
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
const stablePromotionMarkerKeys = [
  "controlSha",
  "exitMergeSha",
  "exitPr",
  "expectedBaseSha",
  "expectedHeadSha",
  "lane",
  "operationId",
  "releaseKind",
  "schemaVersion",
  "type",
] as const;
const baselineMarkerKeys = [
  "controlSha",
  "expectedBaseSha",
  "expectedHeadSha",
  "lane",
  "publishRunId",
  "schemaVersion",
  "stableMergeSha",
  "stablePr",
  "type",
  "versionsSha256",
] as const;

function hasExactKeys(value: object, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

export type PrereleaseMarker = ReleaseMarker & {
  type: "prerelease";
  lane: "minor" | "major";
  operation: "enter" | "exit";
  operationId: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  controlSha: string;
  patchSha256: string;
};

export type StablePromotionMarker = ReleaseMarker & {
  type: "version";
  lane: "minor" | "major";
  releaseKind: "stable-promotion";
  operationId: string;
  expectedBaseSha: string;
  expectedHeadSha: string;
  controlSha: string;
  exitPr: number;
  exitMergeSha: string;
};

export type BaselineMarker = ReleaseMarker & {
  type: "baseline";
  lane: "dev" | "minor" | "major";
  stablePr: number;
  stableMergeSha: string;
  publishRunId: number;
  expectedBaseSha: string;
  expectedHeadSha: string;
  controlSha: string;
  versionsSha256: string;
};

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
    /^[0-9a-f]{64}$/.test(marker.patchSha256)
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
    typeof marker.exitMergeSha === "string" &&
    gitShaPattern.test(marker.exitMergeSha) &&
    marker.expectedBaseSha === marker.exitMergeSha
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
      (!hasExactKeys(parsed, prereleaseMarkerKeys) || !isPrereleaseMarker(parsed))
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
  if (!hasExpectedGeneratedHeadRef(identity.headRef, marker)) return null;
  return marker;
}

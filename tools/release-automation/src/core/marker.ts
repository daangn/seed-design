import type { GeneratedPrType, PullRequestIdentity, ReleaseMarker } from "./types";
import { generatedPrTypes, isActivationOperation, laneNames } from "./types";

const markerPattern = /<!-- seed-release:(\{[^\n]+\}) -->/;
const runIdPattern = /^[1-9][0-9]*$/;

function hasRunIdSuffix(headRef: string, prefix: string): boolean {
  return headRef.startsWith(prefix) && runIdPattern.test(headRef.slice(prefix.length));
}

export function hasExpectedGeneratedHeadRef(headRef: string, marker: ReleaseMarker): boolean {
  if (marker.type === "version") return headRef === `changeset-release/${marker.lane}`;

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
    return marker as ReleaseMarker;
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

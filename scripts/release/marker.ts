import type { GeneratedPrType, PullRequestIdentity, ReleaseMarker } from "./types";
import { generatedPrTypes, laneNames } from "./types";

const prefixByType: Record<GeneratedPrType, string> = {
  version: "changeset-release/",
  transition: "release-transition/",
  sync: "release-sync/",
  freeze: "release-freeze/",
  integration: "release-integration/",
  rebuild: "release-rebuild/",
};

const markerPattern = /<!-- seed-release:(\{[^\n]+\}) -->/;

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
  const marker = parseMarker(identity.body);
  if (!marker) return null;
  if (identity.author !== "github-actions[bot]") return null;
  if (identity.headRepository !== identity.baseRepository) return null;
  if (identity.baseRef !== marker.lane) return null;
  if (!identity.headRef.startsWith(prefixByType[marker.type])) return null;
  if (marker.type === "sync" && marker.targetLane !== marker.lane) return null;
  return marker;
}

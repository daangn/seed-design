import type { LaneName, ReleaseControl, ReleaseMarker } from "../core/types";

export interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

export function parseSemver(value: string): Semver {
  const match = value.match(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z.-]+)?$/,
  );
  if (!match) throw new Error(`유효하지 않은 SemVer입니다: ${value}`);
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4]?.split(".") ?? [],
  };
}

function compareIdentifier(left: string, right: string): number {
  const leftNumber = /^\d+$/.test(left) ? Number(left) : null;
  const rightNumber = /^\d+$/.test(right) ? Number(right) : null;
  if (leftNumber !== null && rightNumber !== null) return leftNumber - rightNumber;
  if (leftNumber !== null) return -1;
  if (rightNumber !== null) return 1;
  return left.localeCompare(right);
}

export function compareSemver(leftValue: string, rightValue: string): number {
  const left = parseSemver(leftValue);
  const right = parseSemver(rightValue);
  for (const key of ["major", "minor", "patch"] as const) {
    if (left[key] !== right[key]) return left[key] - right[key];
  }
  if (left.prerelease.length === 0 || right.prerelease.length === 0) {
    return right.prerelease.length - left.prerelease.length;
  }
  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left.prerelease[index];
    const rightPart = right.prerelease[index];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    const compared = compareIdentifier(leftPart, rightPart);
    if (compared !== 0) return compared;
  }
  return 0;
}

export function assertStableVersionsAdvance(
  planned: Record<string, string>,
  latest: Record<string, string | null>,
): void {
  const invalid = Object.entries(planned).filter(([name, version]) => {
    const current = latest[name];
    return current !== null && current !== undefined && compareSemver(version, current) <= 0;
  });
  if (invalid.length > 0) {
    throw new Error(
      invalid
        .map(
          ([name, version]) => `${name}@${version}은 npm latest ${latest[name]}보다 높지 않습니다.`,
        )
        .join("\n"),
    );
  }
}

export function authorizePublish(
  marker: ReleaseMarker | null,
  mergedBy: string,
  baseLane: LaneName,
  headRef: string,
  control: ReleaseControl,
): "dry-run" | "production" {
  if (!marker || marker.type !== "version" || marker.lane !== baseLane) {
    throw new Error("신뢰할 수 있는 Version Packages PR marker가 없습니다.");
  }
  if (headRef !== `changeset-release/${baseLane}`) {
    throw new Error("Version Packages PR의 head/base 관계가 올바르지 않습니다.");
  }
  if (!mergedBy || mergedBy.endsWith("[bot]")) {
    throw new Error("Version Packages PR은 사람이 merge해야 publish할 수 있습니다.");
  }
  if (control.mode === "production" && !control.rootageContractReady) {
    throw new Error("DES-2201 Rootage 게시 계약이 준비되지 않아 production publish를 막았습니다.");
  }
  return control.mode;
}

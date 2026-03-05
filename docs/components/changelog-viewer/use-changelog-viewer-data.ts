"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import { compareSemver } from "@/components/changelog-viewer/utils";
import type { ChangelogEntry } from "@/lib/parse-changelog";

type VersionRange = {
  from: string;
  to: string;
};

export type GroupedChangelogEntry = {
  packageName: string;
  version: string;
  url: string;
  entries: ChangelogEntry[];
};

type Params = {
  entries: ChangelogEntry[];
  exactVersion: string;
  filterMode: string;
  legacyVersion: string;
  packages: string[];
  selectedPackageForView: string;
  versionFrom: string;
  versionTo: string;
};

function getEffectiveRange({
  exactVersion,
  filterMode,
  legacyVersion,
  versionFrom,
  versionTo,
}: Pick<Params, "exactVersion" | "filterMode" | "legacyVersion" | "versionFrom" | "versionTo">): {
  isExactMode: boolean;
  effectiveRange: VersionRange;
} {
  const isExactMode =
    filterMode === "exact" ||
    exactVersion !== ALL ||
    (legacyVersion !== ALL && versionFrom === ALL && versionTo === ALL);

  const rawFrom = isExactMode
    ? exactVersion !== ALL
      ? exactVersion
      : legacyVersion !== ALL
        ? legacyVersion
        : ALL
    : versionFrom;
  const rawTo = isExactMode
    ? exactVersion !== ALL
      ? exactVersion
      : legacyVersion !== ALL
        ? legacyVersion
        : ALL
    : versionTo;

  const effectiveRange =
    rawFrom !== ALL && rawTo !== ALL && compareSemver(rawFrom, rawTo) > 0
      ? { from: rawTo, to: rawFrom }
      : { from: rawFrom, to: rawTo };

  return { isExactMode, effectiveRange };
}

export function useChangelogViewerData({
  entries,
  exactVersion,
  filterMode,
  legacyVersion,
  packages,
  selectedPackageForView,
  versionFrom,
  versionTo,
}: Params) {
  const { isExactMode, effectiveRange } = getEffectiveRange({
    exactVersion,
    filterMode,
    legacyVersion,
    versionFrom,
    versionTo,
  });

  const versionsForPackage =
    selectedPackageForView === ALL
      ? []
      : [
          ...new Set(
            entries
              .flatMap((entry) => entry.packages)
              .filter((pkg) => pkg.name === selectedPackageForView)
              .map((pkg) => pkg.version),
          ),
        ].sort((a, b) => compareSemver(b, a));

  const filteredEntries = entries.filter((entry) => {
    if (selectedPackageForView === ALL) return true;
    const packageInEntry = entry.packages.find((pkg) => pkg.name === selectedPackageForView);
    if (!packageInEntry) return false;
    if (
      effectiveRange.from !== ALL &&
      compareSemver(packageInEntry.version, effectiveRange.from) < 0
    ) {
      return false;
    }
    if (effectiveRange.to !== ALL && compareSemver(packageInEntry.version, effectiveRange.to) > 0) {
      return false;
    }
    return true;
  });

  const packageOrder = new Map(packages.map((pkg, index) => [pkg, index] as const));
  const groupedByPackageVersion = filteredEntries.reduce<Record<string, GroupedChangelogEntry>>(
    (acc, entry) => {
      const matchedPackages = entry.packages.filter((pkg) => {
        if (selectedPackageForView !== ALL && pkg.name !== selectedPackageForView) return false;
        if (effectiveRange.from !== ALL && compareSemver(pkg.version, effectiveRange.from) < 0) {
          return false;
        }
        if (effectiveRange.to !== ALL && compareSemver(pkg.version, effectiveRange.to) > 0) {
          return false;
        }
        return true;
      });

      for (const pkg of matchedPackages) {
        const key = `${pkg.name}@${pkg.version}`;
        if (!acc[key]) {
          acc[key] = {
            packageName: pkg.name,
            version: pkg.version,
            url: pkg.url,
            entries: [],
          };
        }
        acc[key].entries.push(entry);
      }

      return acc;
    },
    {},
  );

  const groupedEntries = Object.values(groupedByPackageVersion)
    .map((group) => ({
      ...group,
      entries: group.entries.sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .sort((a, b) => {
      const packageDiff =
        (packageOrder.get(a.packageName) ?? Number.MAX_SAFE_INTEGER) -
        (packageOrder.get(b.packageName) ?? Number.MAX_SAFE_INTEGER);
      if (packageDiff !== 0) return packageDiff;
      return compareSemver(b.version, a.version);
    });

  const packageLabel = selectedPackageForView === ALL ? "모든 패키지" : selectedPackageForView;
  const exactLabel = exactVersion === ALL ? "특정 버전" : `${exactVersion}`;
  const fromLabel = versionFrom === ALL ? "시작 버전" : `${versionFrom} 이상`;
  const toLabel = versionTo === ALL ? "끝 버전" : `${versionTo} 이하`;
  const tabVersionSummary = isExactMode
    ? exactVersion === ALL
      ? "exact"
      : exactVersion
    : versionFrom !== ALL && versionTo !== ALL
      ? `${versionFrom}~${versionTo}`
      : versionFrom !== ALL
        ? `${versionFrom}+`
        : versionTo !== ALL
          ? `<=${versionTo}`
          : "all";

  return {
    exactLabel,
    filteredEntries,
    fromLabel,
    groupedEntries,
    isExactMode,
    packageLabel,
    tabVersionSummary,
    toLabel,
    versionsForPackage,
  };
}

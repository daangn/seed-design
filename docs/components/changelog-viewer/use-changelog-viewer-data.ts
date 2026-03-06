"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import { compareSemver } from "@/components/changelog-viewer/utils";
import type { ChangelogEntry } from "@/lib/parse-changelog";

export type GroupedChangelogEntry = {
  packageName: string;
  version: string;
  url: string;
  entries: ChangelogEntry[];
};

type Params = {
  entries: ChangelogEntry[];
  packages: string[];
  selectedPackage: string;
  versionFrom: string;
};

export function useChangelogViewerData({
  entries,
  packages,
  selectedPackage,
  versionFrom,
}: Params) {
  const versionsForPackage =
    selectedPackage === ALL
      ? []
      : [
          ...new Set(
            entries
              .flatMap((entry) => entry.packages)
              .filter((pkg) => pkg.name === selectedPackage)
              .map((pkg) => pkg.version),
          ),
        ].sort((a, b) => compareSemver(b, a));

  const filteredEntries = entries.filter((entry) => {
    if (selectedPackage === ALL) return true;
    const packageInEntry = entry.packages.find((pkg) => pkg.name === selectedPackage);
    if (!packageInEntry) return false;
    if (versionFrom !== ALL && compareSemver(packageInEntry.version, versionFrom) < 0) {
      return false;
    }
    return true;
  });

  const packageOrder = new Map(packages.map((pkg, index) => [pkg, index] as const));
  const groupedByPackageVersion = filteredEntries.reduce<Record<string, GroupedChangelogEntry>>(
    (acc, entry) => {
      const matchedPackages = entry.packages.filter((pkg) => {
        if (selectedPackage !== ALL && pkg.name !== selectedPackage) return false;
        if (versionFrom !== ALL && compareSemver(pkg.version, versionFrom) < 0) {
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

  const filteredEntryCount = filteredEntries.length;
  const versionLabel = versionFrom === ALL ? "전체 변경사항" : `${versionFrom}+`;

  return {
    filteredEntryCount,
    groupedEntries,
    versionLabel,
    versionsForPackage,
  };
}

"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import { compareSemver } from "@/components/changelog-viewer/utils";
import type { ChangelogEntry, ChangelogPackage } from "@/lib/parse-changelog";

export type ResolvedRelatedPackage = ChangelogPackage & {
  resolvedEntries: ChangelogEntry[];
};

export type EnrichedChangelogEntry = Omit<ChangelogEntry, "relatedPackages"> & {
  relatedPackages: ChangelogPackage[];
  resolvedRelatedPackages: ResolvedRelatedPackage[];
};

export type GroupedChangelogEntry = {
  packageName: string;
  version: string;
  url: string;
  entries: EnrichedChangelogEntry[];
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
  const packageOrder = new Map(packages.map((pkg, index) => [pkg, index] as const));

  // 전체 entries로 lookup 빌드 (필터 무관)
  const entryLookup = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const key = `${entry.package.name}@${entry.package.version}`;
    const existing = entryLookup.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      entryLookup.set(key, [entry]);
    }
  }

  const versionsForPackage =
    selectedPackage === ALL
      ? []
      : [
          ...new Set(
            entries.filter((entry) => entry.package.name === selectedPackage).map((entry) => entry.package.version),
          ),
        ].sort((a, b) => compareSemver(b, a));

  const filteredEntries = entries.filter((entry) => {
    if (selectedPackage === ALL) return true;
    if (entry.package.name !== selectedPackage) return false;
    if (versionFrom !== ALL && compareSemver(entry.package.version, versionFrom) < 0) {
      return false;
    }
    return true;
  });

  const groupedByPackageVersion = filteredEntries.reduce<Record<string, GroupedChangelogEntry>>(
    (acc, entry) => {
      const key = `${entry.package.name}@${entry.package.version}`;
      if (!acc[key]) {
        acc[key] = {
          packageName: entry.package.name,
          version: entry.package.version,
          url: entry.package.url,
          entries: [],
        };
      }
      acc[key].entries.push({ ...entry, resolvedRelatedPackages: [] });

      return acc;
    },
    {},
  );

  const mergeRelatedPackages = (base: ChangelogEntry["relatedPackages"], next: ChangelogEntry["relatedPackages"]) =>
    Array.from(new Map([...base, ...next].map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const)).values());

  const groupedEntries = Object.values(groupedByPackageVersion)
    .map((group) => ({
      ...group,
      entries: (() => {
        const sorted = group.entries.sort((a, b) => a.order - b.order);
        const result = sorted.reduce<EnrichedChangelogEntry[]>((acc, entry) => {
          if (!entry.isDependencyOnly) {
            acc.push(entry);
            return acc;
          }

          const targets = acc.filter((candidate) =>
            candidate.commitRefs.some((ref) => entry.commitRefs.includes(ref)),
          );

          const targetEntries = targets.length > 0 ? targets : acc.length > 0 ? [acc[acc.length - 1]] : [];

          for (const targetEntry of targetEntries) {
            targetEntry.relatedPackages = mergeRelatedPackages(targetEntry.relatedPackages, entry.relatedPackages);
          }

          return acc;
        }, []);

        if (result.length === 0 && sorted.length > 0) {
          const depEntries = sorted.filter((e) => e.isDependencyOnly);
          for (const entry of depEntries) {
            result.push(entry);
          }
        }

        // relatedPackages를 resolve해서 resolvedRelatedPackages에 주입
        for (const entry of result) {
          const unique = Array.from(
            new Map(entry.relatedPackages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const)).values(),
          );
          entry.resolvedRelatedPackages = unique.map((pkg) => ({
            ...pkg,
            resolvedEntries: (entryLookup.get(`${pkg.name}@${pkg.version}`) ?? []).filter(
              (e) => !e.isDependencyOnly,
            ),
          }));
        }

        return result;
      })(),
    }))
    .sort((a, b) => {
      const packageDiff =
        (packageOrder.get(a.packageName) ?? Number.MAX_SAFE_INTEGER) -
        (packageOrder.get(b.packageName) ?? Number.MAX_SAFE_INTEGER);
      if (packageDiff !== 0) return packageDiff;

      if (versionFrom !== ALL) {
        return compareSemver(a.version, b.version);
      }

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

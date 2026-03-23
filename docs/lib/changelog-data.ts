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

export type EntryLookup = Map<string, ChangelogEntry[]>;

export function buildEntryLookup(entries: ChangelogEntry[]): EntryLookup {
  const lookup: EntryLookup = new Map();
  for (const entry of entries) {
    const key = `${entry.package.name}@${entry.package.version}`;
    const existing = lookup.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      lookup.set(key, [entry]);
    }
  }
  return lookup;
}

function mergeRelatedPackages(
  base: ChangelogEntry["relatedPackages"],
  next: ChangelogEntry["relatedPackages"],
) {
  return Array.from(
    new Map([...base, ...next].map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const)).values(),
  );
}

function resolveGroupEntries(
  groupEntries: EnrichedChangelogEntry[],
  entryLookup: EntryLookup,
): EnrichedChangelogEntry[] {
  const sorted = groupEntries.sort((a, b) => a.order - b.order);
  const result = sorted.reduce<EnrichedChangelogEntry[]>((acc, entry) => {
    if (!entry.isDependencyOnly) {
      acc.push(entry);
      return acc;
    }

    const targets = acc.filter((candidate) =>
      candidate.commitRefs.some((ref) => entry.commitRefs.includes(ref)),
    );

    const targetEntries =
      targets.length > 0 ? targets : acc.length > 0 ? [acc[acc.length - 1]] : [];

    for (const targetEntry of targetEntries) {
      targetEntry.relatedPackages = mergeRelatedPackages(
        targetEntry.relatedPackages,
        entry.relatedPackages,
      );
    }

    return acc;
  }, []);

  if (result.length === 0 && sorted.length > 0) {
    const depEntries = sorted.filter((e) => e.isDependencyOnly);
    for (const entry of depEntries) {
      result.push(entry);
    }
  }

  for (const entry of result) {
    const unique = Array.from(
      new Map(
        entry.relatedPackages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const),
      ).values(),
    );
    entry.resolvedRelatedPackages = unique.map((pkg) => ({
      ...pkg,
      resolvedEntries: (entryLookup.get(`${pkg.name}@${pkg.version}`) ?? []).filter(
        (e) => !e.isDependencyOnly,
      ),
    }));
  }

  return result;
}

type ResolveAndGroupParams = {
  entries: ChangelogEntry[];
  packages: string[];
  selectedPackage: string;
  versionFrom: string;
  allValue: string;
};

export function resolveAndGroupEntries({
  entries,
  packages,
  selectedPackage,
  versionFrom,
  allValue,
  compareSemver,
}: ResolveAndGroupParams & {
  compareSemver: (a: string, b: string) => number;
}): {
  filteredEntryCount: number;
  groupedEntries: GroupedChangelogEntry[];
  versionLabel: string;
  versionsForPackage: string[];
} {
  const packageOrder = new Map(packages.map((pkg, index) => [pkg, index] as const));
  const entryLookup = buildEntryLookup(entries);

  const versionsForPackage =
    selectedPackage === allValue
      ? []
      : [
          ...new Set(
            entries
              .filter((entry) => entry.package.name === selectedPackage)
              .map((entry) => entry.package.version),
          ),
        ].sort((a, b) => compareSemver(b, a));

  const filteredEntries = entries.filter((entry) => {
    if (selectedPackage === allValue) return true;
    if (entry.package.name !== selectedPackage) return false;
    if (versionFrom !== allValue && compareSemver(entry.package.version, versionFrom) < 0) {
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

  const groupedEntries = Object.values(groupedByPackageVersion)
    .map((group) => ({
      ...group,
      entries: resolveGroupEntries(group.entries, entryLookup),
    }))
    .sort((a, b) => {
      const packageDiff =
        (packageOrder.get(a.packageName) ?? Number.MAX_SAFE_INTEGER) -
        (packageOrder.get(b.packageName) ?? Number.MAX_SAFE_INTEGER);
      if (packageDiff !== 0) return packageDiff;

      if (versionFrom !== allValue) {
        return compareSemver(a.version, b.version);
      }

      return compareSemver(b.version, a.version);
    });

  const filteredEntryCount = filteredEntries.length;
  const versionLabel = versionFrom === allValue ? "전체 변경사항" : `${versionFrom}+`;

  return {
    filteredEntryCount,
    groupedEntries,
    versionLabel,
    versionsForPackage,
  };
}

"use client";

import type { ChangelogEntry } from "@/lib/parse-changelog";
import { ChangelogEntryItem } from "@/components/changelog-entry-item";
import { IconCheckmarkFill, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { useQueryState } from "nuqs";
import { useState } from "react";

const ALL = "all";

const PINNED_PACKAGES = ["@seed-design/react", "@seed-design/css", "@seed-design/stackflow"];

function compareSemver(a: string, b: string): number {
  const normalize = (v: string) =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((part) => Number(part.replace(/[^\d].*$/, "")) || 0);

  const [aMajor = 0, aMinor = 0, aPatch = 0] = normalize(a);
  const [bMajor = 0, bMinor = 0, bPatch = 0] = normalize(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  if (aPatch !== bPatch) return aPatch - bPatch;
  return a.localeCompare(b);
}

export function ChangelogViewer({
  entries,
  packages: rawPackages,
}: {
  entries: ChangelogEntry[];
  packages: string[];
}) {
  const packages = [
    ...PINNED_PACKAGES.filter((p) => rawPackages.includes(p)),
    ...rawPackages.filter((p) => !PINNED_PACKAGES.includes(p)).sort(),
  ];
  const [selectedPackage, setSelectedPackage] = useQueryState("package", {
    defaultValue: ALL,
    history: "push",
  });
  const [versionFrom, setVersionFrom] = useQueryState("from", {
    defaultValue: ALL,
    history: "push",
  });
  const [versionTo, setVersionTo] = useQueryState("to", {
    defaultValue: ALL,
    history: "push",
  });
  const [exactVersion, setExactVersion] = useQueryState("exact", {
    defaultValue: ALL,
    history: "push",
  });
  const [legacyVersion, setLegacyVersion] = useQueryState("version", {
    defaultValue: ALL,
    history: "push",
  });
  const [filterMode, setFilterMode] = useQueryState("mode", {
    defaultValue: "range",
    history: "push",
  });
  const [packageOpen, setPackageOpen] = useState(false);
  const [exactVersionOpen, setExactVersionOpen] = useState(false);
  const [versionFromOpen, setVersionFromOpen] = useState(false);
  const [versionToOpen, setVersionToOpen] = useState(false);

  const versionsForPackage =
    selectedPackage === ALL
      ? []
      : [
          ...new Set(
            entries
              .flatMap((e) => e.packages)
              .filter((p) => p.name === selectedPackage)
              .map((p) => p.version),
          ),
        ].sort((a, b) => compareSemver(b, a));

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

  const filteredEntries = entries.filter((e) => {
    if (selectedPackage === ALL) return true;
    const pkg = e.packages.find((p) => p.name === selectedPackage);
    if (!pkg) return false;
    if (effectiveRange.from !== ALL && compareSemver(pkg.version, effectiveRange.from) < 0)
      return false;
    if (effectiveRange.to !== ALL && compareSemver(pkg.version, effectiveRange.to) > 0)
      return false;
    return true;
  });

  const packageLabel = selectedPackage === ALL ? "모든 패키지" : selectedPackage;
  const exactLabel = exactVersion === ALL ? "특정 버전" : `${exactVersion}`;
  const fromLabel = versionFrom === ALL ? "시작 버전" : `${versionFrom} 이상`;
  const toLabel = versionTo === ALL ? "끝 버전" : `${versionTo} 이하`;
  const packageOrder = new Map(packages.map((pkg, i) => [pkg, i] as const));

  const groupedByPackageVersion = filteredEntries.reduce<
    Record<string, { packageName: string; version: string; url: string; entries: ChangelogEntry[] }>
  >((acc, entry) => {
    const matchedPackages = entry.packages.filter((pkg) => {
      if (selectedPackage !== ALL && pkg.name !== selectedPackage) return false;
      if (effectiveRange.from !== ALL && compareSemver(pkg.version, effectiveRange.from) < 0)
        return false;
      if (effectiveRange.to !== ALL && compareSemver(pkg.version, effectiveRange.to) > 0)
        return false;
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
  }, {});

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={packageOpen} onOpenChange={setPackageOpen}>
          <PopoverTrigger
            className={buttonVariants({
              color: "secondary",
              size: "sm",
              className: "gap-2 items-center max-w-72 truncate",
            })}
          >
            <span className="truncate">{packageLabel}</span>
            <IconChevronDownLine className="size-3.5 text-fd-muted-foreground shrink-0" />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col overflow-auto max-h-72 w-64 p-1">
            <button
              type="button"
              className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
              onClick={() => {
                void setSelectedPackage(null);
                void setExactVersion(null);
                void setVersionFrom(null);
                void setVersionTo(null);
                void setLegacyVersion(null);
                setPackageOpen(false);
              }}
            >
              <IconCheckmarkFill
                className={`size-3.5 shrink-0 ${selectedPackage === ALL ? "opacity-100" : "opacity-0"}`}
              />
              모든 패키지
            </button>
            {packages.map((pkg) => (
              <button
                key={pkg}
                type="button"
                className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                onClick={() => {
                  void setSelectedPackage(pkg);
                  void setExactVersion(null);
                  void setVersionFrom(null);
                  void setVersionTo(null);
                  void setLegacyVersion(null);
                  setPackageOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${selectedPackage === pkg ? "opacity-100" : "opacity-0"}`}
                />
                <span className="truncate text-xs font-mono">{pkg}</span>
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {selectedPackage !== ALL && (
          <div className="inline-flex items-center rounded-md border border-fd-border p-0.5">
            <button
              type="button"
              className={`px-2.5 py-1 text-xs rounded ${isExactMode ? "bg-fd-accent text-fd-accent-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"}`}
              onClick={() => {
                void setFilterMode("exact");
                void setVersionFrom(null);
                void setVersionTo(null);
              }}
            >
              특정 버전
            </button>
            <button
              type="button"
              className={`px-2.5 py-1 text-xs rounded ${!isExactMode ? "bg-fd-accent text-fd-accent-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"}`}
              onClick={() => {
                void setFilterMode("range");
                void setExactVersion(null);
                void setLegacyVersion(null);
              }}
            >
              범위
            </button>
          </div>
        )}

        {selectedPackage !== ALL && isExactMode && (
          <Popover open={exactVersionOpen} onOpenChange={setExactVersionOpen}>
            <PopoverTrigger
              className={buttonVariants({
                color: "secondary",
                size: "sm",
                className: "gap-2 items-center font-mono",
              })}
            >
              <span>{exactLabel}</span>
              <IconChevronDownLine className="size-3.5 text-fd-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col overflow-auto max-h-72 w-44 p-1">
              <button
                type="button"
                className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                onClick={() => {
                  void setExactVersion(null);
                  void setLegacyVersion(null);
                  setExactVersionOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${exactVersion === ALL ? "opacity-100" : "opacity-0"}`}
                />
                특정 버전 없음
              </button>
              {versionsForPackage.map((ver) => (
                <button
                  key={`exact-${ver}`}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("exact");
                    void setExactVersion(ver);
                    void setVersionFrom(null);
                    void setVersionTo(null);
                    void setLegacyVersion(null);
                    setExactVersionOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${exactVersion === ver ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{ver}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        {selectedPackage !== ALL && !isExactMode && (
          <Popover open={versionFromOpen} onOpenChange={setVersionFromOpen}>
            <PopoverTrigger
              className={buttonVariants({
                color: "secondary",
                size: "sm",
                className: "gap-2 items-center font-mono",
              })}
            >
              <span>{fromLabel}</span>
              <IconChevronDownLine className="size-3.5 text-fd-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col overflow-auto max-h-72 w-44 p-1">
              <button
                type="button"
                className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                onClick={() => {
                  void setExactVersion(null);
                  void setVersionFrom(null);
                  void setLegacyVersion(null);
                  setVersionFromOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${versionFrom === ALL ? "opacity-100" : "opacity-0"}`}
                />
                시작 버전 없음
              </button>
              {versionsForPackage.map((ver) => (
                <button
                  key={ver}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("range");
                    void setExactVersion(null);
                    void setVersionFrom(ver);
                    void setLegacyVersion(null);
                    setVersionFromOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${versionFrom === ver ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{ver}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        {selectedPackage !== ALL && !isExactMode && (
          <Popover open={versionToOpen} onOpenChange={setVersionToOpen}>
            <PopoverTrigger
              className={buttonVariants({
                color: "secondary",
                size: "sm",
                className: "gap-2 items-center font-mono",
              })}
            >
              <span>{toLabel}</span>
              <IconChevronDownLine className="size-3.5 text-fd-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col overflow-auto max-h-72 w-44 p-1">
              <button
                type="button"
                className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                onClick={() => {
                  void setExactVersion(null);
                  void setVersionTo(null);
                  void setLegacyVersion(null);
                  setVersionToOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${versionTo === ALL ? "opacity-100" : "opacity-0"}`}
                />
                끝 버전 없음
              </button>
              {versionsForPackage.map((ver) => (
                <button
                  key={`to-${ver}`}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("range");
                    void setExactVersion(null);
                    void setVersionTo(ver);
                    void setLegacyVersion(null);
                    setVersionToOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${versionTo === ver ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{ver}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        {selectedPackage !== ALL && (
          <span className="text-sm text-fd-muted-foreground">{filteredEntries.length}개 항목</span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {groupedEntries.map((group) => (
          <section
            key={`${group.packageName}@${group.version}`}
            className="rounded-xl border border-fd-border"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap border-b border-fd-border px-4 py-2.5 bg-fd-card/50">
              <div className="inline-flex items-center gap-1.5 min-w-0">
                <span className="text-fd-muted-foreground">📦</span>
                <a
                  href={`/react/updates/changelog?package=${encodeURIComponent(group.packageName)}&exact=${encodeURIComponent(group.version)}`}
                  className="truncate text-sm md:text-base font-semibold font-mono hover:text-fd-primary transition-colors"
                >
                  {group.packageName}@{group.version}
                </a>
              </div>
              <span className="text-xs text-fd-muted-foreground shrink-0">
                {group.entries.length}개 변경사항
              </span>
            </div>
            <div className="px-3 py-1">
              <ul className="list-disc pl-5 pr-1 marker:text-fd-muted-foreground">
                {group.entries.map((entry, i) => {
                  const additionalPackages = entry.packages.filter(
                    (pkg) => !(pkg.name === group.packageName && pkg.version === group.version),
                  );
                  const uniqueAdditionalPackages = Array.from(
                    new Map(
                      additionalPackages.map((pkg) => [`${pkg.name}@${pkg.version}`, pkg] as const),
                    ).values(),
                  );

                  return (
                    <li
                      key={`${group.packageName}@${group.version}-${entry.date}-${entry.label ?? ""}-${i}`}
                    >
                      <ChangelogEntryItem entry={entry} hideDate hidePackages compact />
                      {uniqueAdditionalPackages.length > 0 && (
                        <details className="mt-1.5">
                          <summary className="cursor-pointer text-xs text-fd-muted-foreground hover:text-fd-foreground select-none">
                            추가 영향 패키지 {uniqueAdditionalPackages.length}개
                          </summary>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {uniqueAdditionalPackages.map((pkg) => (
                              <a
                                key={`${pkg.name}@${pkg.version}`}
                                href={`/react/updates/changelog?package=${encodeURIComponent(pkg.name)}&exact=${encodeURIComponent(pkg.version)}`}
                                className="inline-flex items-center rounded-md border border-fd-border px-2 py-0.5 text-[11px] font-mono text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent/60 transition-colors"
                              >
                                <span>{pkg.name}@{pkg.version}</span>
                              </a>
                            ))}
                          </div>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
        {groupedEntries.length === 0 && (
          <div className="text-sm text-fd-muted-foreground px-1">
            조건에 맞는 변경사항이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

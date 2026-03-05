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
  const [selectedVersion, setSelectedVersion] = useQueryState("version", {
    defaultValue: ALL,
    history: "push",
  });
  const [packageOpen, setPackageOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);

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
        ];

  const filteredEntries = entries.filter((e) => {
    if (selectedPackage === ALL) return true;
    const pkgMatch = e.packages.some((p) => p.name === selectedPackage);
    if (!pkgMatch) return false;
    if (selectedVersion === ALL) return true;
    return e.packages.some((p) => p.name === selectedPackage && p.version === selectedVersion);
  });

  const packageLabel = selectedPackage === ALL ? "모든 패키지" : selectedPackage;
  const versionLabel = selectedVersion === ALL ? "모든 버전" : selectedVersion;
  const packageOrder = new Map(packages.map((pkg, i) => [pkg, i] as const));

  const groupedByPackageVersion = filteredEntries.reduce<
    Record<string, { packageName: string; version: string; url: string; entries: ChangelogEntry[] }>
  >((acc, entry) => {
    const matchedPackages = entry.packages.filter((pkg) => {
      if (selectedPackage !== ALL && pkg.name !== selectedPackage) return false;
      if (selectedVersion !== ALL && pkg.version !== selectedVersion) return false;
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
      return b.version.localeCompare(a.version, undefined, { numeric: true });
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
                void setSelectedVersion(null);
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
                  void setSelectedVersion(null);
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
          <Popover open={versionOpen} onOpenChange={setVersionOpen}>
            <PopoverTrigger
              className={buttonVariants({
                color: "secondary",
                size: "sm",
                className: "gap-2 items-center font-mono",
              })}
            >
              <span>{versionLabel}</span>
              <IconChevronDownLine className="size-3.5 text-fd-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col overflow-auto max-h-72 w-44 p-1">
              <button
                type="button"
                className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                onClick={() => {
                  void setSelectedVersion(null);
                  setVersionOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${selectedVersion === ALL ? "opacity-100" : "opacity-0"}`}
                />
                모든 버전
              </button>
              {versionsForPackage.map((ver) => (
                <button
                  key={ver}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setSelectedVersion(ver);
                    setVersionOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${selectedVersion === ver ? "opacity-100" : "opacity-0"}`}
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
                  href={`/react/updates/changelog?package=${encodeURIComponent(group.packageName)}&version=${encodeURIComponent(group.version)}`}
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
                {group.entries.map((entry, i) => (
                  <li
                    key={`${group.packageName}@${group.version}-${entry.date}-${entry.label ?? ""}-${i}`}
                  >
                    <ChangelogEntryItem entry={entry} hideDate hidePackages compact />
                  </li>
                ))}
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

"use client";

import type { ChangelogEntry } from "@/lib/parse-changelog";
import { IconCheckmarkFill, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { useQueryState } from "nuqs";
import { useState } from "react";

const ALL = "all";

export function ChangelogViewer({
  entries,
  packages,
}: {
  entries: ChangelogEntry[];
  packages: string[];
}) {
  const [selectedPackage, setSelectedPackage] = useQueryState("package", {
    defaultValue: ALL,
  });
  const [selectedVersion, setSelectedVersion] = useQueryState("version", {
    defaultValue: ALL,
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

  const isGrouped = selectedPackage === ALL;

  const groupedByDate = isGrouped
    ? filteredEntries.reduce<Record<string, ChangelogEntry[]>>((acc, entry) => {
        const key = entry.label ? `${entry.date} ${entry.label}` : entry.date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
      }, {})
    : null;

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

        {(selectedPackage !== ALL || selectedVersion !== ALL) && (
          <span className="text-sm text-fd-muted-foreground">{filteredEntries.length}개 항목</span>
        )}
      </div>

      {isGrouped && groupedByDate ? (
        <div className="flex flex-col gap-10">
          {Object.entries(groupedByDate).map(([dateKey, dateEntries]) => (
            <div key={dateKey} className="flex flex-col gap-4">
              <time className="text-lg font-semibold text-fd-foreground border-b border-fd-border pb-2">
                {dateKey}
              </time>
              <div className="flex flex-col divide-y divide-fd-border">
                {dateEntries.map((entry, i) => (
                  <ChangelogEntryItem
                    key={`${entry.date}-${entry.label ?? ""}-${i}`}
                    entry={entry}
                    hideDate
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-fd-border">
          {filteredEntries.map((entry, i) => (
            <ChangelogEntryItem key={`${entry.date}-${entry.label ?? ""}-${i}`} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChangelogEntryItem({
  entry,
  hideDate = false,
}: {
  entry: ChangelogEntry;
  hideDate?: boolean;
}) {
  return (
    <div className="py-6 first:pt-0 flex flex-col gap-3">
      {!hideDate && (
        <time className="text-sm font-medium text-fd-muted-foreground">
          {entry.date}
          {entry.label && <span className="ml-1">{entry.label}</span>}
        </time>
      )}

      {entry.contentHtml && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-a:text-fd-primary prose-code:text-fd-primary prose-code:bg-fd-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side parsed markdown
          dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
        />
      )}

      {entry.packages.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.packages.map((pkg) => (
            <a
              key={`${pkg.name}@${pkg.version}`}
              href={pkg.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md border border-fd-border bg-fd-card text-fd-foreground hover:bg-fd-accent transition-colors font-mono"
            >
              <span className="text-fd-muted-foreground">📦</span>
              <span>{pkg.name}</span>
              <span className="text-fd-muted-foreground">@</span>
              <span className="font-semibold">{pkg.version}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

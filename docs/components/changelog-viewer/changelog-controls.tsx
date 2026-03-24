"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import { IconCheckmarkFill, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";

type QueryStateSetter = (value: string | null) => unknown;

type PackageRailProps = {
  selectedPackage: string;
  packages: string[];
  switchCompareTab: (pkg: string) => void;
};

type FilterBarProps = {
  filteredEntryCount: number;
  selectedPackage: string;
  setVersionFrom: QueryStateSetter;
  setVersionFromOpen: (open: boolean) => void;
  versionLabel: string;
  versionFrom: string;
  versionFromOpen: boolean;
  versionsForPackage: string[];
};

export function ChangelogPackageRail({
  selectedPackage,
  packages,
  switchCompareTab,
}: PackageRailProps) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <div className="mb-3 text-xs font-medium text-fd-muted-foreground">패키지</div>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {packages.map((pkg) => {
          const isActive = selectedPackage === pkg;
          const label = pkg;

          return (
            <button
              key={pkg}
              type="button"
              className={`rounded-md border px-2.5 py-2 text-left text-xs font-mono transition-colors lg:w-full ${
                isActive
                  ? "border-fd-border bg-fd-accent text-fd-accent-foreground"
                  : "border-fd-border text-fd-muted-foreground hover:text-fd-foreground"
              }`}
              onClick={() => switchCompareTab(pkg)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChangelogFilterBar({
  filteredEntryCount,
  selectedPackage,
  setVersionFrom,
  setVersionFromOpen,
  versionLabel,
  versionFrom,
  versionFromOpen,
  versionsForPackage,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fd-border bg-fd-card px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs font-medium text-fd-muted-foreground">버전 필터</div>
      </div>
      <div className="flex items-center gap-2 self-start">
        {selectedPackage !== ALL && (
          <Popover open={versionFromOpen} onOpenChange={setVersionFromOpen}>
            <PopoverTrigger
              className={buttonVariants({
                color: "secondary",
                size: "sm",
                className: "gap-2 items-center font-mono",
              })}
            >
              <span>{versionLabel}</span>
              <IconChevronDownLine className="size-3.5 shrink-0 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex max-h-72 w-44 flex-col overflow-auto p-1">
              <button
                type="button"
                className={`flex items-center gap-2 rounded-md p-2 text-left text-sm ${
                  versionFrom === ALL
                    ? "bg-fd-accent text-fd-accent-foreground"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
                onClick={() => {
                  void setVersionFrom(null);
                  setVersionFromOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${versionFrom === ALL ? "opacity-100" : "opacity-0"}`}
                />
                전체 변경사항
              </button>
              {versionsForPackage.map((version) => (
                <button
                  key={version}
                  type="button"
                  className={`flex items-center gap-2 rounded-md p-2 text-left text-sm ${
                    versionFrom === version
                      ? "bg-fd-accent text-fd-accent-foreground"
                      : "text-fd-muted-foreground hover:text-fd-foreground"
                  }`}
                  onClick={() => {
                    void setVersionFrom(version);
                    setVersionFromOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${versionFrom === version ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{version}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}
        {selectedPackage !== ALL && (
          <span className="text-sm text-fd-muted-foreground">{filteredEntryCount}개 항목</span>
        )}
      </div>
    </div>
  );
}

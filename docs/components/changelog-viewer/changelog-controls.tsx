"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import {
  IconCheckmarkFill,
  IconChevronDownLine,
  IconXmarkLine,
} from "@karrotmarket/react-monochrome-icon";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";

type QueryStateSetter = (value: string | null) => unknown;

type ChangelogControlsProps = {
  addCompareTab: (pkg: string) => void;
  addCompareTabOpen: boolean;
  availableCompareTabsToAdd: string[];
  compareTabs: string[];
  effectiveCompareTab: string;
  exactLabel: string;
  exactVersion: string;
  exactVersionOpen: boolean;
  filteredEntryCount: number;
  fromLabel: string;
  isExactMode: boolean;
  removeCompareTab: (pkg: string) => void;
  selectedPackageForView: string;
  setAddCompareTabOpen: (open: boolean) => void;
  setExactVersion: QueryStateSetter;
  setExactVersionOpen: (open: boolean) => void;
  setFilterMode: QueryStateSetter;
  setVersionFrom: QueryStateSetter;
  setVersionFromOpen: (open: boolean) => void;
  setVersionTo: QueryStateSetter;
  setVersionToOpen: (open: boolean) => void;
  switchCompareTab: (pkg: string) => void;
  tabVersionSummary: string;
  toLabel: string;
  versionFrom: string;
  versionFromOpen: boolean;
  versionTo: string;
  versionToOpen: boolean;
  versionsForPackage: string[];
};

export function ChangelogControls({
  addCompareTab,
  addCompareTabOpen,
  availableCompareTabsToAdd,
  compareTabs,
  effectiveCompareTab,
  exactLabel,
  exactVersion,
  exactVersionOpen,
  filteredEntryCount,
  fromLabel,
  isExactMode,
  removeCompareTab,
  selectedPackageForView,
  setAddCompareTabOpen,
  setExactVersion,
  setExactVersionOpen,
  setFilterMode,
  setVersionFrom,
  setVersionFromOpen,
  setVersionTo,
  setVersionToOpen,
  switchCompareTab,
  tabVersionSummary,
  toLabel,
  versionFrom,
  versionFromOpen,
  versionTo,
  versionToOpen,
  versionsForPackage,
}: ChangelogControlsProps) {
  return (
    <>
      {compareTabs.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {compareTabs.map((pkg) => {
            const isActive = effectiveCompareTab === pkg;
            const label = pkg.replace("@seed-design/", "");
            return (
              <div
                key={pkg}
                className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-mono ${
                  isActive
                    ? "border-fd-primary text-fd-primary bg-fd-primary/5"
                    : "border-fd-border text-fd-muted-foreground"
                }`}
              >
                <button
                  type="button"
                  className="cursor-pointer hover:text-fd-foreground transition-colors"
                  onClick={() => switchCompareTab(pkg)}
                >
                  {label}
                  {isActive ? ` · ${tabVersionSummary}` : ""}
                </button>
                <button
                  type="button"
                  className="ml-1 cursor-pointer hover:text-fd-foreground transition-colors"
                  onClick={() => removeCompareTab(pkg)}
                  aria-label={`${pkg} 탭 닫기`}
                >
                  <IconXmarkLine className="size-3" />
                </button>
              </div>
            );
          })}
          {availableCompareTabsToAdd.length > 0 && (
            <Popover open={addCompareTabOpen} onOpenChange={setAddCompareTabOpen}>
              <PopoverTrigger className="px-2.5 py-1 text-xs rounded-md border border-fd-border text-fd-muted-foreground hover:text-fd-foreground">
                + 패키지 추가
              </PopoverTrigger>
              <PopoverContent className="flex flex-col overflow-auto max-h-72 w-64 p-1">
                {availableCompareTabsToAdd.map((pkg) => (
                  <button
                    key={pkg}
                    type="button"
                    className="text-sm p-2 rounded-md text-left hover:bg-fd-accent hover:text-fd-accent-foreground"
                    onClick={() => addCompareTab(pkg)}
                  >
                    <span className="text-xs font-mono">{pkg}</span>
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {selectedPackageForView !== ALL && (
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
              }}
            >
              범위
            </button>
          </div>
        )}

        {selectedPackageForView !== ALL && isExactMode && (
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
                  setExactVersionOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${exactVersion === ALL ? "opacity-100" : "opacity-0"}`}
                />
                특정 버전 없음
              </button>
              {versionsForPackage.map((version) => (
                <button
                  key={`exact-${version}`}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("exact");
                    void setExactVersion(version);
                    void setVersionFrom(null);
                    void setVersionTo(null);
                    setExactVersionOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${exactVersion === version ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{version}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        {selectedPackageForView !== ALL && !isExactMode && (
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
                  setVersionFromOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${versionFrom === ALL ? "opacity-100" : "opacity-0"}`}
                />
                시작 버전 없음
              </button>
              {versionsForPackage.map((version) => (
                <button
                  key={version}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("range");
                    void setExactVersion(null);
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

        {selectedPackageForView !== ALL && !isExactMode && (
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
                  setVersionToOpen(false);
                }}
              >
                <IconCheckmarkFill
                  className={`size-3.5 shrink-0 ${versionTo === ALL ? "opacity-100" : "opacity-0"}`}
                />
                끝 버전 없음
              </button>
              {versionsForPackage.map((version) => (
                <button
                  key={`to-${version}`}
                  type="button"
                  className="text-sm p-2 rounded-md text-left flex items-center gap-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
                  onClick={() => {
                    void setFilterMode("range");
                    void setExactVersion(null);
                    void setVersionTo(version);
                    setVersionToOpen(false);
                  }}
                >
                  <IconCheckmarkFill
                    className={`size-3.5 shrink-0 ${versionTo === version ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-xs font-mono">{version}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        {selectedPackageForView !== ALL && (
          <span className="text-sm text-fd-muted-foreground">{filteredEntryCount}개 항목</span>
        )}
      </div>
    </>
  );
}

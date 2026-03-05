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
  isCompareMode: boolean;
  isExactMode: boolean;
  packageLabel: string;
  packageLatestVersionMap: Map<string, string | null>;
  packageOpen: boolean;
  packages: string[];
  removeCompareTab: (pkg: string) => void;
  selectedPackageForView: string;
  setActiveCompareTab: QueryStateSetter;
  setAddCompareTabOpen: (open: boolean) => void;
  setExactVersion: QueryStateSetter;
  setExactVersionOpen: (open: boolean) => void;
  setFilterMode: QueryStateSetter;
  setLegacyVersion: QueryStateSetter;
  setPackageOpen: (open: boolean) => void;
  setSelectedPackage: QueryStateSetter;
  setVersionFrom: QueryStateSetter;
  setVersionFromOpen: (open: boolean) => void;
  setVersionTo: QueryStateSetter;
  setVersionToOpen: (open: boolean) => void;
  setViewMode: QueryStateSetter;
  switchCompareTab: (pkg: string) => void;
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
  isCompareMode,
  isExactMode,
  packageLabel,
  packageLatestVersionMap,
  packageOpen,
  packages,
  removeCompareTab,
  selectedPackageForView,
  setActiveCompareTab,
  setAddCompareTabOpen,
  setExactVersion,
  setExactVersionOpen,
  setFilterMode,
  setLegacyVersion,
  setPackageOpen,
  setSelectedPackage,
  setVersionFrom,
  setVersionFromOpen,
  setVersionTo,
  setVersionToOpen,
  setViewMode,
  switchCompareTab,
  toLabel,
  versionFrom,
  versionFromOpen,
  versionTo,
  versionToOpen,
  versionsForPackage,
}: ChangelogControlsProps) {
  return (
    <>
      <div className="inline-flex items-center rounded-md border border-fd-border p-0.5 w-fit">
        <button
          type="button"
          className={`px-2.5 py-1 text-xs rounded ${!isCompareMode ? "bg-fd-accent text-fd-accent-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"}`}
          onClick={() => {
            void setViewMode("single");
          }}
        >
          단일 패키지
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 text-xs rounded ${isCompareMode ? "bg-fd-accent text-fd-accent-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"}`}
          onClick={() => {
            if (compareTabs.length > 0) {
              void setActiveCompareTab(effectiveCompareTab);
            }
            void setViewMode("compare");
          }}
        >
          여러 패키지 비교
        </button>
      </div>

      <p className="text-xs text-fd-muted-foreground">
        {isCompareMode
          ? "react, css, stackflow처럼 여러 패키지를 탭으로 빠르게 비교합니다."
          : "한 패키지를 선택해 특정 버전 또는 버전 범위로 자세히 확인합니다."}
      </p>

      {isCompareMode && compareTabs.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {compareTabs.map((pkg) => {
            const latest = packageLatestVersionMap.get(pkg);
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
                  className="hover:text-fd-foreground transition-colors"
                  onClick={() => switchCompareTab(pkg)}
                >
                  {label}
                  {latest ? ` · ${latest}` : ""}
                </button>
                <button
                  type="button"
                  className="ml-1 hover:text-fd-foreground transition-colors"
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
        {!isCompareMode && (
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
                  className={`size-3.5 shrink-0 ${selectedPackageForView === ALL ? "opacity-100" : "opacity-0"}`}
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
                    className={`size-3.5 shrink-0 ${selectedPackageForView === pkg ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="truncate text-xs font-mono">{pkg}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

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
                void setLegacyVersion(null);
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
                  void setLegacyVersion(null);
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
                    void setLegacyVersion(null);
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
                  void setLegacyVersion(null);
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
                    void setLegacyVersion(null);
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
                  void setLegacyVersion(null);
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
                    void setLegacyVersion(null);
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

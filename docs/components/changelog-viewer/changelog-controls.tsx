"use client";

import { ALL } from "@/components/changelog-viewer/constants";
import {
  DocsMenuContent,
  DocsMenuGroup,
  DocsMenuItem,
  DocsMenuRoot,
  DocsMenuTrigger,
  DocsMenuTriggerButton,
} from "@/components/docs-menu";
import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { clsx } from "cn";
import { type CSSProperties, useState } from "react";

type QueryStateSetter = (value: string | null) => unknown;

type FilterBarProps = {
  filteredEntryCount: number;
  selectedPackage: string;
  packages: string[];
  setVersionFrom: QueryStateSetter;
  setVersionFromOpen: (open: boolean) => void;
  switchCompareTab: (pkg: string) => void;
  versionLabel: string;
  versionFrom: string;
  versionFromOpen: boolean;
  versionsForPackage: string[];
};

const packageMenuContentClassName =
  "max-h-[min(28rem,calc(100dvh-8rem))] w-[min(22rem,calc(100vw-2rem))]";
const packageMenuContentStyle = {
  "--seed-menu-available-height": "min(28rem, calc(100dvh - 8rem))",
} as CSSProperties;
const versionMenuContentClassName = "max-h-72";
const versionMenuContentStyle = {
  "--seed-menu-available-height": "18rem",
} as CSSProperties;

function PackageMenu({
  selectedPackage,
  packages,
  switchCompareTab,
}: Pick<FilterBarProps, "selectedPackage" | "packages" | "switchCompareTab">) {
  const [open, setOpen] = useState(false);

  return (
    <DocsMenuRoot open={open} onOpenChange={setOpen} placement="bottom-start">
      <DocsMenuTrigger asChild>
        <DocsMenuTriggerButton className="max-w-full justify-between md:max-w-[320px]">
          <span className="min-w-0 truncate text-left font-mono text-xs">{selectedPackage}</span>
          <IconChevronDownLine
            className={clsx("shrink-0 transition-transform", open && "rotate-180")}
          />
        </DocsMenuTriggerButton>
      </DocsMenuTrigger>
      <DocsMenuContent className={packageMenuContentClassName} style={packageMenuContentStyle}>
        <DocsMenuGroup>
          {packages.map((pkg) => {
            const active = selectedPackage === pkg;

            return (
              <DocsMenuItem
                key={pkg}
                aria-current={active ? "true" : undefined}
                label={<span className="font-mono text-xs">{pkg}</span>}
                suffixIcon={active ? <IconCheckmarkLine /> : undefined}
                onClick={() => {
                  if (!active) switchCompareTab(pkg);
                  setOpen(false);
                }}
              />
            );
          })}
        </DocsMenuGroup>
      </DocsMenuContent>
    </DocsMenuRoot>
  );
}

function VersionMenu({
  selectedPackage,
  setVersionFrom,
  setVersionFromOpen,
  versionLabel,
  versionFrom,
  versionFromOpen,
  versionsForPackage,
}: Pick<
  FilterBarProps,
  | "selectedPackage"
  | "setVersionFrom"
  | "setVersionFromOpen"
  | "versionLabel"
  | "versionFrom"
  | "versionFromOpen"
  | "versionsForPackage"
>) {
  const disabled = selectedPackage === ALL;

  return (
    <DocsMenuRoot
      open={disabled ? false : versionFromOpen}
      onOpenChange={(open) => {
        if (!disabled) setVersionFromOpen(open);
      }}
      placement="bottom-start"
      matchReferenceWidth
    >
      <DocsMenuTrigger asChild>
        <DocsMenuTriggerButton
          disabled={disabled}
          className="max-w-full justify-between md:max-w-[220px]"
        >
          <span className="min-w-0 truncate text-left font-mono text-xs">{versionLabel}</span>
          <IconChevronDownLine
            className={clsx(
              "shrink-0 transition-transform",
              !disabled && versionFromOpen && "rotate-180",
            )}
          />
        </DocsMenuTriggerButton>
      </DocsMenuTrigger>
      <DocsMenuContent className={versionMenuContentClassName} style={versionMenuContentStyle}>
        <DocsMenuGroup>
          <DocsMenuItem
            aria-current={versionFrom === ALL ? "true" : undefined}
            label="전체 변경사항"
            suffixIcon={versionFrom === ALL ? <IconCheckmarkLine /> : undefined}
            onClick={() => {
              void setVersionFrom(null);
              setVersionFromOpen(false);
            }}
          />
          {versionsForPackage.map((version) => (
            <DocsMenuItem
              key={version}
              aria-current={versionFrom === version ? "true" : undefined}
              label={<span className="font-mono text-xs">{version}</span>}
              suffixIcon={versionFrom === version ? <IconCheckmarkLine /> : undefined}
              onClick={() => {
                void setVersionFrom(version);
                setVersionFromOpen(false);
              }}
            />
          ))}
        </DocsMenuGroup>
      </DocsMenuContent>
    </DocsMenuRoot>
  );
}

export function ChangelogFilterBar({
  filteredEntryCount,
  selectedPackage,
  packages,
  setVersionFrom,
  setVersionFromOpen,
  switchCompareTab,
  versionLabel,
  versionFrom,
  versionFromOpen,
  versionsForPackage,
}: FilterBarProps) {
  return (
    <div className="sticky top-14 z-30 -mx-1 mb-x6 bg-fd-background/95 py-x3 backdrop-blur min-[1120px]:top-[76px]">
      <div className="flex min-w-0 flex-col gap-x2 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x2">
          <span className="t3-regular text-fg-neutral-muted">필터</span>
          <PackageMenu
            selectedPackage={selectedPackage}
            packages={packages}
            switchCompareTab={switchCompareTab}
          />
          <VersionMenu
            selectedPackage={selectedPackage}
            setVersionFrom={setVersionFrom}
            setVersionFromOpen={setVersionFromOpen}
            versionLabel={versionLabel}
            versionFrom={versionFrom}
            versionFromOpen={versionFromOpen}
            versionsForPackage={versionsForPackage}
          />
        </div>
        <span className="t3-regular shrink-0 text-fg-neutral-muted">
          {filteredEntryCount.toLocaleString()}개 항목
        </span>
      </div>
    </div>
  );
}

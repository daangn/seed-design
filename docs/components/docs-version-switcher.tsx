"use client";

import { archivePaths } from "@/lib/docs-archive";

import {
  DocsMenuContent,
  DocsMenuGroup,
  DocsMenuItem,
  DocsMenuRoot,
  DocsMenuTrigger,
  DocsMenuTriggerButton,
} from "@/components/docs-menu";
import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { type ComponentProps, useState } from "react";
import clsx from "clsx";

interface DocsVersion {
  label: string;
  url: string;
}

// The first entry of each platform is the latest site.
const PUBLISHED_VERSIONS = {
  react: [
    { label: "latest (v3)", url: "https://seed-design.io/react" },
    { label: "v2", url: "https://seed-design.io/react/v2" },
    { label: "v1.2", url: "https://seed-design.io/react/v1.2" },
    { label: "v1.1", url: "https://seed-design.io/react/v1.1" },
    { label: "v1.0", url: "https://seed-design.io/react/v1.0" },
  ],
  lynx: [
    { label: "latest (v1)", url: "https://seed-design.io/lynx" },
    { label: "v0", url: "https://seed-design.io/lynx/v0" },
  ],
} as const satisfies Record<string, readonly [DocsVersion, ...DocsVersion[]]>;

export type DocsVersionPlatform = keyof typeof PUBLISHED_VERSIONS;

export function getDocsVersions(
  platform: DocsVersionPlatform,
  archive: { platform?: string; version: string },
): { versions: ReadonlyArray<DocsVersion>; current: DocsVersion } {
  const [latest, ...archived] = PUBLISHED_VERSIONS[platform];
  // An archive build of another platform still shows this platform's latest docs.
  const archiveVersion = archive.platform === platform ? archive.version : "";
  const listed = PUBLISHED_VERSIONS[platform].find((version) => version.label === archiveVersion);
  if (!archiveVersion || listed) {
    return { versions: PUBLISHED_VERSIONS[platform], current: listed ?? latest };
  }
  // A future archive must identify itself even before it is added to the latest site's menu.
  const current = {
    label: archiveVersion,
    url: `https://seed-design.io/${platform}/${archiveVersion}`,
  };
  return { versions: [latest, current, ...archived], current };
}

export function DocsVersionSwitcher({
  platform,
  positionerContainer,
}: { platform: DocsVersionPlatform } & Pick<
  ComponentProps<typeof DocsMenuContent>,
  "positionerContainer"
>) {
  const [open, setOpen] = useState(false);

  // The release branch embeds its archive channel; regular Pages previews remain latest.
  const { versions, current } = getDocsVersions(platform, archivePaths);

  return (
    <DocsMenuRoot open={open} onOpenChange={setOpen} placement="bottom-start" matchReferenceWidth>
      <DocsMenuTrigger asChild>
        <DocsMenuTriggerButton className="w-full justify-between!">
          <span className="min-w-0 text-left">{current.label}</span>
          <IconChevronDownLine
            className={clsx("shrink-0 transition-transform", open && "rotate-180")}
          />
        </DocsMenuTriggerButton>
      </DocsMenuTrigger>
      <DocsMenuContent positionerContainer={positionerContainer}>
        <DocsMenuGroup>
          {versions.map((version) => (
            <DocsMenuItem
              key={version.label}
              aria-current={version === current ? "true" : undefined}
              label={version.label}
              suffixIcon={version === current ? <IconCheckmarkLine /> : undefined}
              onClick={() => {
                if (version === current) return;

                window.open(version.url, "_blank", "noopener,noreferrer");
              }}
            />
          ))}
        </DocsMenuGroup>
      </DocsMenuContent>
    </DocsMenuRoot>
  );
}

import { archivePaths } from "@/lib/docs-archive";

import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { type ComponentProps, lazy, Suspense } from "react";
import type DocsVersionMenuImpl from "./docs-version-menu";
import { DocsMenuTriggerButton } from "./docs-menu-trigger-button";
import { useMenuIntent } from "./use-menu-intent";

// 메뉴 module(SEED Menu·floating-ui)은 사용자가 버튼에 다가갈 때 받는다(`use-menu-intent.ts`).
const loadMenu = () => import("./docs-version-menu");
const DocsVersionMenu = lazy(loadMenu);

export interface DocsVersion {
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
  ComponentProps<typeof DocsVersionMenuImpl>,
  "positionerContainer"
>) {
  const intent = useMenuIntent("click", loadMenu);

  // The release branch embeds its archive channel; regular Pages previews remain latest.
  const { versions, current } = getDocsVersions(platform, archivePaths);

  const trigger = (
    <DocsMenuTriggerButton
      className="w-full justify-between!"
      aria-haspopup="menu"
      aria-expanded="false"
      {...intent.triggerProps}
    >
      <span className="min-w-0 text-left">{current.label}</span>
      <IconChevronDownLine className="shrink-0 transition-transform" />
    </DocsMenuTriggerButton>
  );
  if (!intent.requested) return trigger;
  return (
    <Suspense fallback={trigger}>
      <DocsVersionMenu
        versions={versions}
        current={current}
        defaultOpen={intent.clicked}
        positionerContainer={positionerContainer}
      />
    </Suspense>
  );
}

"use client";

import { archivePaths } from "@/lib/docs-archive";

import { IconHorizline3VerticalLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { RootProvider } from "fumadocs-ui/provider/base";
import { SiteLink } from "@/components/site-link";
import type { ComponentProps } from "react";
import { SeedMark } from "../landing/seed-mark";
import { DocsFrameworkProvider } from "../layout/docs-framework-provider";
import { ActionButton, SearchButton, ThemeToggle } from "./header-actions";
import { mobileNavOpenStore } from "./open-stores";
import { SiteHeader } from "./site-header";

/**
 * Header for docs detail pages. Desktop-lite starts at 968px so
 * tablet widths keep the top navigation and sidebar context; below that a compact
 * bar opens the responsive navigation panel.
 */
export function DocsHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={clsx(
        // Sit in the fumadocs notebook `header` grid area (sidebar-col + main + toc columns)
        // instead of spanning the full viewport, so the header's left/right edges line up with
        // the sidebar and ToC. The bar heights (64px mobile, 72px tablet, 76px desktop) are set
        // as --fd-header-height on the layout root (`src/layouts/DocsLayout.astro`), which feeds
        // the sidebar's `top-(--fd-docs-row-2)` so it drops below the header on scroll.
        // Keep [grid-area:header] on all breakpoints: spanning full width ([grid-column:1/-1])
        // would let the header's min-content inflate the flexible side gutters and collapse the
        // main column on sparse pages. The mobile bar handles its own full-bleed instead.
        "sticky top-0 z-40 [grid-area:header]",
        className,
      )}
    >
      {/* Opaque so page content doesn't bleed through the sticky bar (landing stays
          transparent; docs pages scroll plain content behind the header). */}
      <div className="hidden bg-fd-background min-[968px]:block">
        <SiteHeader density="docs" />
      </div>

      {/* Full-bleed to the viewport. A plain w-full bar would inherit <header>'s grid-area
          offset: those side gutters are 0 with a sidebar but non-zero in no-sidebar layouts
          (404, get-started, updates), which pushed the bar right and overflowed it off-screen.
          Gutters are symmetric, so the header is viewport-centered — left-1/2 + -50vw margin
          re-centers the 100vw bar on the viewport (the SEED preset has no translate utilities). */}
      <div className="relative left-[50%] ml-[-50vw] flex h-16 w-screen items-center justify-between bg-fd-background px-4 min-[968px]:hidden">
        <SiteLink
          href={archivePaths.link("/")}
          aria-label="SEED Design System 홈"
          className="text-palette-gray-1000 dark:text-palette-static-white"
        >
          <SeedMark className="h-10 w-auto" />
        </SiteLink>
        <div className="flex items-center gap-2.5 text-fg-neutral">
          <ThemeToggle size="size-10" />
          <SearchButton size="size-10" />
          <ActionButton label="메뉴" size="size-10" onClick={() => mobileNavOpenStore.set(true)}>
            <IconHorizline3VerticalLine />
          </ActionButton>
        </div>
      </div>
    </header>
  );
}

/**
 * 문서 헤더 island. 테마 provider(next-themes, `d` 단축키)를 맡는다. 검색 창은 검색 island, 모바일 메뉴 패널은
 * 내비게이션 island가 그리고, 두 버튼은 `open-stores.ts`의 열림 상태만 바꾼다.
 */
export function DocsHeaderIsland({ pathname }: { pathname: string }) {
  return (
    <DocsFrameworkProvider pathname={pathname}>
      <RootProvider search={{ enabled: false }}>
        <DocsHeader />
      </RootProvider>
    </DocsFrameworkProvider>
  );
}

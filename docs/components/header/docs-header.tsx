"use client";

import { IconHorizline3VerticalLine } from "@karrotmarket/react-monochrome-icon";
import { clsx } from "cn";
import type * as PageTree from "fumadocs-core/page-tree";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useState } from "react";
import { resolveDocsSection } from "@/lib/docs-sections";
import { SeedMark } from "../landing/seed-mark";
import { buildSidebarGroups } from "../layout/docs-side-navigation-items";
import { ActionButton, SearchButton, ThemeToggle } from "./header-actions";
import { MobileNavPanel, type MobileNavSection } from "./mobile-nav-panel";
import { SiteHeader } from "./site-header";

export function buildDocsMobileSection(
  nodes: PageTree.Node[],
  pathname: string,
): MobileNavSection | undefined {
  const section = resolveDocsSection(pathname);
  if (!section) return undefined;

  return {
    title: section.label,
    groups: buildSidebarGroups(nodes, pathname),
  };
}

/**
 * Fumadocs `slots.header` for docs detail pages. Desktop-lite starts at 968px so
 * tablet widths keep the top navigation and sidebar context; below that a compact
 * bar opens the responsive navigation panel.
 */
export function DocsHeader({ className, ...props }: ComponentProps<"header">) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { root } = useTreeContext();
  const pathname = usePathname();
  const section = buildDocsMobileSection(root.children, pathname);

  return (
    <header
      {...props}
      className={clsx(
        // Sit in the fumadocs notebook `header` grid area (sidebar-col + main + toc columns)
        // instead of spanning the full viewport, so the header's left/right edges line up with
        // the sidebar and ToC. The `layout:` variant sets --fd-header-height on the layout
        // container (via `#nd-notebook-layout:has(&)`), which feeds the sidebar's
        // `top-(--fd-docs-row-2)` so it drops below the header on scroll — otherwise the value
        // stays on <header> and never reaches the sidebar (64px mobile bar,
        // 72px tablet bar, 76px desktop).
        // Keep [grid-area:header] on all breakpoints: spanning full width ([grid-column:1/-1])
        // would let the header's min-content inflate the flexible side gutters and collapse the
        // main column on sparse pages. The mobile bar handles its own full-bleed instead.
        "sticky top-0 z-40 [grid-area:header] layout:[--fd-header-height:64px] min-[968px]:layout:[--fd-header-height:72px] min-[1120px]:layout:[--fd-header-height:76px]",
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
        <Link
          href="/"
          aria-label="SEED Design System 홈"
          className="text-palette-gray-1000 dark:text-palette-static-white"
        >
          <SeedMark className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2.5 text-fg-neutral">
          <ThemeToggle size="size-10" />
          <SearchButton size="size-10" />
          <ActionButton label="메뉴" size="size-10" onClick={() => setPanelOpen(true)}>
            <IconHorizline3VerticalLine />
          </ActionButton>
        </div>
      </div>
      <MobileNavPanel open={panelOpen} onOpenChange={setPanelOpen} section={section} />
    </header>
  );
}

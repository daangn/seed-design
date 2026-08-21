"use client";

import {
  IconHorizline3VerticalLine,
  IconMagnifyingglassFill,
} from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useState, type ReactNode } from "react";
import { MobileNavPanel } from "../header/mobile-nav-panel";
import { SiteNav } from "../header/nav-menu";
import { LANDING_LIGHT_ONLY_COLOR_BRIDGE } from "./landing-theme";
import { SeedMark } from "./seed-mark";
import { SeedWordmark } from "./seed-wordmark";

/**
 * - `expanded`: hero + bento — a full-width bar. Logo (mark + "SEED" wordmark) sits
 *   at the left edge, nav centered, actions at the right edge. No background bar.
 * - `collapsed`: every section after bento — the three groups gather into a single
 *   centered translucent pill; the "SEED" wordmark collapses away, leaving the mark.
 * - `hidden`: footer — slides up out of view (slides back down when scrolling up).
 *
 * The spread→gather is a pure-CSS `grid-template-columns` morph: outer rail tracks
 * (`0fr`↔`1fr`) center the cluster, inner rail tracks (`1fr`↔`0fr`) close the gaps.
 * The pill background is a grid child spanning only the content columns, so it hugs
 * the gathered cluster instead of the full width.
 */
export type HeaderVariant = "expanded" | "collapsed" | "hidden";

type Tone = "black" | "white";

const EASE_DUR = "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
/** Shared morph: everything that differs between states tweens on this curve. */
const MORPH = `transition-all ${EASE_DUR} motion-reduce:transition-none`;
const TONE_CLASSES: Record<Tone, string> = {
  black:
    "[--landing-header-fg:#212121] [--color-fg-neutral:#212121] [--color-fg-neutral-muted:#212121] [--color-palette-gray-1000:#212121]",
  white:
    "[--landing-header-fg:#fff] [--color-fg-neutral:#fff] [--color-fg-neutral-muted:#fff] [--color-palette-gray-1000:#fff]",
};

function IconButton({
  label,
  className,
  onClick,
  pressed,
  size = "size-10",
  children,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  pressed?: boolean;
  size?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className={clsx(
        MORPH,
        size,
        "flex items-center justify-center rounded-full hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LandingHeader({ variant, tone }: { variant: HeaderVariant; tone: Tone }) {
  const isExpanded = variant === "expanded";
  const isHidden = variant === "hidden";
  const { setOpenSearch } = useSearchContext();
  const [panelOpen, setPanelOpen] = useState(false);
  const openSearch = () => setOpenSearch(true);
  const desktopActionClassName = isExpanded
    ? "bg-palette-static-white-alpha-600"
    : "translate-x-4 bg-transparent";

  return (
    <>
      <header
        className={clsx(
          // `right`: same scroll-lock trim the footer compensates for (see section-footer) —
          // <body> narrows by the removed scrollbar width while this fixed bar does not, which
          // would slide the right-hand actions out of line with the page under them.
          "fixed inset-x-0 right-[var(--removed-body-scroll-bar-size,0px)] top-0 z-[1000]",
          LANDING_LIGHT_ONLY_COLOR_BRIDGE,
          `transition-transform ${EASE_DUR} motion-reduce:transition-none`,
          isHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
        )}
      >
        {/* Single morphing grid. Columns: [outerL] logo [railL] nav [railR] actions [outerR].
            Expanded fills the outer rails (cluster spreads to the px-8 edges); collapsed
            fills the inner rails into the outer ones (cluster gathers + centers). */}
        <div
          className={clsx(
            // Match the docs header's container (fumadocs --fd-layout-width default 97rem,
            // px-4) so the logo/actions sit at the same x → no layout shift when navigating
            // between landing and docs.
            "mx-auto h-[76px] w-full max-w-[97rem] items-center px-4 text-[var(--landing-header-fg)]",
            "min-[968px]:h-[72px] min-[968px]:px-3 min-[1120px]:h-[76px] min-[1120px]:px-4",
            "hidden min-[968px]:grid",
            TONE_CLASSES[tone],
            MORPH,
            isExpanded
              ? "grid-cols-[0fr_auto_1fr_auto_1fr_auto_0fr]"
              : "grid-cols-[1fr_auto_0fr_auto_0fr_auto_1fr]",
          )}
        >
          {/* Pill background — spans the content columns only (2–6), behind the groups.
              ponytail: -mx-6 extends the bg 24px past the cluster on each side = the pill's
              24px inner padding; the overhang falls into the empty outer rails. */}
          <div
            aria-hidden
            className={clsx(
              "col-start-2 col-end-7 row-start-1 rounded-full",
              MORPH,
              isExpanded
                ? "h-0 bg-transparent backdrop-blur-0"
                : "-mx-6 h-[58px] bg-palette-static-white-alpha-100 backdrop-blur-[60px]",
            )}
          />

          {/* Logo: mark always; wordmark in a clipping wrapper that collapses to 0 width.
              Landing is light-only, so avoid Tailwind's global dark variant here. */}
          <div className="relative z-10 col-start-2 row-start-1 flex items-center text-[var(--landing-header-fg)]">
            <SeedMark className="h-10 w-auto shrink-0 min-[968px]:h-8 min-[1120px]:h-9 min-[1280px]:h-10" />
            <div
              className={clsx(
                "overflow-hidden",
                MORPH,
                isExpanded
                  ? "ml-2 min-[968px]:ml-1.5 min-[1120px]:ml-2 max-w-[80px] opacity-100"
                  : "ml-0 max-w-0 opacity-0",
              )}
            >
              <SeedWordmark className="h-10 w-auto min-[968px]:h-8 min-[1120px]:h-9 min-[1280px]:h-10" />
            </div>
          </div>

          {/* Center nav: the shared docs SiteNav, dropped into this grid cell so landing and
              docs render byte-identical nav items (same padding/gap/weight → no layout shift
              when navigating between them). SiteNav's own NavigationMenuProvider is
              context-only, so the <nav> stays the direct grid child and keeps its placement.
              The constant mx-6 = the pill's inner group gaps (absorbed by the 1fr rails when
              expanded). On "/" nothing matches, so every item renders muted (no active item). */}
          <SiteNav className="relative z-10 col-start-4 row-start-1 mx-6" density="docs" />

          {/* Right: landing search action. The docs (detail) header centers its nav at the true
              container center (`1fr auto 1fr`); this landing bar is a morphing pill grid that
              centers the nav BETWEEN the logo and the actions instead. So to land the nav at the
              same x as the docs header — no shift when navigating between them — the right actions
              must be as wide as the logo cluster. This invisible spacer pads them to the logo
              width at each breakpoint (the logo scales h-8/9/10, so the pad tracks it), then
              collapses to 0 when the cluster gathers into the pill.
              ponytail: pixel pads are tuned to the SEED wordmark width (measured on the deployed
              preview: nav centered within ~1px at 968/1120/1280 bands). Re-measure if the logo or
              wordmark changes. */}
          <div className="relative z-10 col-start-6 row-start-1 flex items-center gap-1.5 text-[var(--landing-header-fg)]">
            <div
              aria-hidden
              className={clsx(
                MORPH,
                isExpanded
                  ? "min-[968px]:w-[56px] min-[1120px]:w-[63px] min-[1280px]:w-[76px]"
                  : "w-0",
              )}
            />
            <IconButton
              label="검색"
              onClick={openSearch}
              className={desktopActionClassName}
              size="min-[968px]:size-8 min-[1120px]:size-9"
            >
              <IconMagnifyingglassFill aria-hidden className="size-4" />
            </IconButton>
          </div>
        </div>

        {/* Mobile bar (< lg) — fixed 64px top bar, no morph; the wrapper handles the footer hide.
            px = global gutter, items vertically centered. Logo mark plus playback, search, and menu. */}
        <div
          className={clsx(
            "h-16 items-center justify-between px-spacing-x-global-gutter text-[var(--landing-header-fg)]",
            "flex min-[968px]:hidden",
            TONE_CLASSES[tone],
          )}
        >
          <SeedMark className="h-10 w-auto" />
          <div className="flex items-center gap-2.5 text-fg-neutral">
            <IconButton label="검색" onClick={openSearch} className="bg-bg-transparent-selected">
              <IconMagnifyingglassFill aria-hidden className="size-4" />
            </IconButton>
            <IconButton
              label="메뉴"
              onClick={() => setPanelOpen(true)}
              className="bg-bg-transparent-selected"
            >
              <IconHorizline3VerticalLine aria-hidden className="size-4" />
            </IconButton>
          </div>
        </div>
      </header>
      <MobileNavPanel open={panelOpen} onOpenChange={setPanelOpen} />
    </>
  );
}

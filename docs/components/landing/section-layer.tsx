import type { CSSProperties, ReactNode } from "react";

/**
 * mobileStack class sets, keyed by the breakpoint the pin/region-height engages at
 * (`pinFrom`). Full literal strings (not interpolated) so Tailwind generates every
 * variant. `md` is the default; `lg` lets a section flow at its natural height through
 * the tablet band (e.g. bento, whose grid gets an aspect ratio there instead of 100dvh).
 */
const MOBILE_STACK_SECTION = {
  md: "h-auto md:h-[var(--region-h)]",
  lg: "h-auto lg:h-[var(--region-h)]",
} as const;
const MOBILE_STACK_PANEL_STICKY = {
  md: "relative h-auto md:sticky md:top-0 md:h-dvh",
  lg: "relative h-auto lg:sticky lg:top-0 lg:h-dvh",
} as const;
const MOBILE_STACK_PANEL_FLOW = {
  md: "relative h-auto md:h-full",
  lg: "relative h-auto lg:h-full",
} as const;

interface SectionLayerProps {
  /** Used by the header state machine and scene selectors (`#id`). */
  id: string;
  /** Stacking order — controls cover vs reveal between neighbors. */
  z: number;
  /** Scroll-region height in vh. `regionVh - 100` is the pinned dwell budget. */
  regionVh: number;
  /** Classes for the visible panel (background, bottom radius, etc.). */
  panelClassName?: string;
  /** Classes for the outer scroll-region `<section>`. */
  sectionClassName?: string;
  /**
   * Background of the scroll region BEHIND the panel. With a bottom radius this
   * is what shows through the rounded corners — set it to the next section's
   * color so the layer reads as sitting on top of the one beneath it.
   */
  behindClassName?: string;
  /**
   * Sticky panels pin to the top while their region scrolls (default). Pass false
   * to keep the panel in normal flow instead (e.g. the bento grid).
   */
  sticky?: boolean;
  /**
   * On mobile (below `pinFrom`), drop the pin and the fixed region height so the
   * panel grows with content — used by sections that become a 1-column stack (or a
   * natural-height block) on small screens.
   */
  mobileStack?: boolean;
  /** Force the compact in-flow form without waiting for responsive CSS (SSR shell). */
  forceStacked?: boolean;
  /**
   * Breakpoint at which a `mobileStack` section engages its pin + fixed region
   * height. Default `md` (768). Pass `lg` (1024) to keep the section natural-height
   * through the tablet band too (bento uses this so its grid can hold a proper aspect
   * ratio at tablet instead of being stretched to 100dvh).
   */
  pinFrom?: "md" | "lg";
  /**
   * Grow with content: no pin, no fixed region height, no overflow clip. The
   * section scrolls normally and is as tall as its children, so an inner
   * `sticky` column works (window stays the scroll root). `regionVh` is ignored.
   * Used by Values (sticky title + a scrolling list of cards).
   */
  growToContent?: boolean;
  /**
   * Optional accent strip pinned to the bottom of the scroll region, BEHIND the
   * panel. With a panel `rounded-b`, the rounded corners reveal this color (e.g. the
   * carrot footer) while the flat top/side seams stay on the page background — so the
   * corner reads as a colored reveal without a full carrot `behindClassName` (which
   * would leak orange at the TOP seam too). Height should match the panel's radius.
   */
  bottomAccentClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * One layer of the sticky-stack landing page. The outer element owns the scroll
 * region (height + z-index); the inner panel is what the user sees. Because each
 * panel sticks at top:0 and neighbors are ordered by z-index, scrolling produces
 * the cover / reveal transitions without per-frame JS.
 */
export function SectionLayer({
  id,
  z,
  regionVh,
  panelClassName = "",
  sectionClassName = "",
  behindClassName = "",
  sticky = true,
  mobileStack = false,
  forceStacked = false,
  pinFrom = "md",
  growToContent = false,
  bottomAccentClassName,
  style,
  children,
}: SectionLayerProps) {
  // growToContent: plain in-flow section sized to its children. No overflow clip
  // so an inner sticky column pins against the window scroll.
  if (growToContent) {
    return (
      <section
        id={id}
        data-section={id}
        className={`relative w-full ${behindClassName} ${sectionClassName}`}
        style={{ zIndex: z, ...style }}
      >
        <div className={`relative w-full ${panelClassName}`}>{children}</div>
      </section>
    );
  }

  // mobileStack: region height becomes a CSS var applied only from `pinFrom` up, so the
  // section flows with its content below it instead of being clipped to one screen.
  // forceStacked keeps the unresolved SSR compact shell in-flow at every viewport size.
  const heightStyle: CSSProperties & Record<string, string> = forceStacked
    ? {}
    : mobileStack
      ? { "--region-h": `${regionVh}dvh` }
      : { height: `${regionVh}dvh` };

  const panelStackClass = sticky
    ? MOBILE_STACK_PANEL_STICKY[pinFrom]
    : MOBILE_STACK_PANEL_FLOW[pinFrom];

  return (
    <section
      id={id}
      data-section={id}
      className={`relative w-full ${behindClassName} ${sectionClassName} ${
        forceStacked ? "h-auto" : mobileStack ? MOBILE_STACK_SECTION[pinFrom] : ""
      }`}
      style={{ ...heightStyle, zIndex: z, ...style }}
    >
      {bottomAccentClassName && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-5 ${bottomAccentClassName}`}
        />
      )}
      <div
        className={`w-full overflow-hidden ${panelClassName} ${
          forceStacked
            ? "relative h-auto"
            : mobileStack
              ? panelStackClass
              : sticky
                ? "sticky top-0 h-dvh"
                : "relative h-full"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

import type { CSSProperties, ReactNode } from "react";

interface SectionLayerProps {
  /** Used by the header state machine and scene selectors (`#id`). */
  id: string;
  /** Stacking order — controls cover vs reveal between neighbors. */
  z: number;
  /** Scroll-region height in vh. `regionVh - 100` is the pinned dwell budget. */
  regionVh: number;
  /** Classes for the visible panel (background, bottom radius, etc.). */
  panelClassName?: string;
  /**
   * Background of the scroll region BEHIND the panel. With a bottom radius this
   * is what shows through the rounded corners — set it to the next section's
   * color so the layer reads as sitting on top of the one beneath it.
   */
  behindClassName?: string;
  /**
   * Sticky panels pin to the top while their region scrolls (default). The last
   * section (footer) opts out so it simply sits underneath and gets revealed.
   */
  sticky?: boolean;
  /**
   * On mobile (< lg), drop the pin and the fixed region height so the panel grows
   * with content — used by sections that become a 1-column stack on small screens.
   */
  mobileStack?: boolean;
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
  behindClassName = "",
  sticky = true,
  mobileStack = false,
  style,
  children,
}: SectionLayerProps) {
  // mobileStack: region height becomes a CSS var applied only from lg up, so the
  // section flows with its content on mobile instead of being clipped to one screen.
  const heightStyle: CSSProperties & Record<string, string> = mobileStack
    ? { "--region-h": `${regionVh}dvh` }
    : { height: `${regionVh}dvh` };

  return (
    <section
      id={id}
      data-section={id}
      className={`relative w-full ${behindClassName} ${mobileStack ? "h-auto lg:h-[var(--region-h)]" : ""}`}
      style={{ ...heightStyle, zIndex: z, ...style }}
    >
      <div
        className={`w-full overflow-hidden ${panelClassName} ${
          mobileStack
            ? "relative h-auto lg:sticky lg:top-0 lg:h-dvh"
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

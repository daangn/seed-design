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
  style,
  children,
}: SectionLayerProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={`relative w-full ${behindClassName}`}
      style={{ height: `${regionVh}dvh`, zIndex: z, ...style }}
    >
      <div
        className={`${sticky ? "sticky top-0 h-dvh" : "relative h-full"} w-full overflow-hidden ${panelClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

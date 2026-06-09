import { HERO_VIDEO, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 1 — Hero.
 * Full-bleed intro video on the carrot brand backdrop (shown until the video
 * paints / as a letterbox fallback).
 */
export function SectionHero() {
  return (
    <SectionLayer
      id="hero"
      z={Z.hero}
      regionVh={REGIONS.hero}
      panelClassName="bg-palette-carrot-600"
    >
      <video
        className="size-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    </SectionLayer>
  );
}

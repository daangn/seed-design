import { HERO_VIDEO, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 1 — Hero.
 * The single full-bleed intro video on the carrot brand backdrop. As the section
 * pins, the frame gains padding + rounded corners (`createHeroToBento`) so the
 * video reads as a card before the bento grid assembles next. This is the only
 * hero video on the page — the bento reuses the moment, it doesn't re-add a video.
 */
export function SectionHero() {
  return (
    <SectionLayer
      id="hero"
      z={Z.hero}
      regionVh={REGIONS.hero}
      panelClassName="bg-palette-carrot-600"
    >
      <div data-hero-frame className="box-border size-full overflow-hidden">
        <video
          className="size-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      </div>
    </SectionLayer>
  );
}

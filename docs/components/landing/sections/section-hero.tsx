import { HERO_VIDEO, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 1 — Hero.
 * The single full-bleed intro video on a white stage (matching the bento section).
 * As the section pins, the frame gains padding and the video itself rounds its
 * corners (`createHeroToBento`) so the video shrinks into a card on a white gutter,
 * exactly like a bento slot, before the grid assembles. This is the only hero video
 * on the page — the bento reuses the moment, it doesn't re-add a video.
 */
export function SectionHero() {
  return (
    <SectionLayer id="hero" z={Z.hero} regionVh={REGIONS.hero} panelClassName="bg-white">
      <div data-hero-frame className="box-border size-full">
        <video
          data-hero-video
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

"use client";

import { HeroVideo } from "../components/hero-video";
import { HERO_POSTER, HERO_VIDEO, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 1 — Hero.
 * The single full-bleed intro video on a white stage (matching the bento section).
 * As the section pins, the frame gains padding and the video itself rounds its
 * corners (`createHeroToBento`) so the video shrinks into a card on a white gutter,
 * exactly like a bento slot, before the grid assembles. This is the only hero video
 * on the page — the bento reuses the moment, it doesn't re-add a video.
 *
 * The play/pause button rides the rounding card (`[data-hero-video]` is the positioning
 * context) and only appears after the video's first loop — see HeroVideo.
 */
export function SectionHero({
  prefersReducedMotion,
  resolved,
}: {
  prefersReducedMotion: boolean;
  resolved: boolean;
}) {
  return (
    <SectionLayer
      id="hero"
      z={Z.hero}
      regionVh={REGIONS.hero}
      sectionClassName="hidden md:block"
      panelClassName="bg-white"
    >
      <div data-hero-frame className="box-border size-full">
        <div data-hero-video className="relative size-full overflow-hidden">
          <HeroVideo
            prefersReducedMotion={prefersReducedMotion}
            resolved={resolved}
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            wrapperClassName="size-full bg-[#f3f3f3]"
            videoClassName="size-full object-cover"
            buttonClassName="bottom-4 right-4"
          />
        </div>
      </div>
    </SectionLayer>
  );
}

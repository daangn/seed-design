import type { LottieController } from "../components/scrub-lottie";
import { ValueMotion } from "../components/value-motion";
import { RevealText } from "../components/reveal-text";
import { DARK_BG, REGIONS, VALUE_CARDS, VALUES_TITLE, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 4 — Values.
 * Dark stage (#121212), a left title beside a right column of three principle cards.
 *
 * Layout is two-column from md (768): the left title column is a clamp width and the right
 * card column is `flex-1`. Cards are 640px-capped and right-aligned within it, so they hug
 * the right edge of the 1200px container (matched to the 05 Showcase / 06 Blog title grid so
 * the left edges line up). Nothing has a fixed px width, so it never overflows the tablet.
 *
 * The heavy scroll CHOREOGRAPHY is lg-only (≥1024) and coupled to the 03 Intro stage:
 * `-mt-[140dvh]` pulls Values up under the pinned intro, the title pins in a `sticky`
 * h-dvh column, and the card column gets long dwell gaps + lead/trail padding timed to
 * the 03→04 crossfade (see createIntroValuesCrossfade / createValuesReveal). Below lg
 * there is no intro, so Values is a plain two-column that flows after 02 Bento: the title
 * scrolls with the content and each card just reveals on enter (createValuesReveal).
 * On mobile (<768) it collapses to a one-column stack.
 */
interface SectionValuesProps {
  /** Enables the md+ Lottie visual after layout and Reduced Motion are resolved. */
  motionEnabled: boolean;
  /** Receives each card's paused Lottie so createValuesScrub can scrub it on scroll. */
  onValueLottieReady?: (index: number, controller: LottieController) => void;
}

export function SectionValues({ motionEnabled, onValueLottieReady }: SectionValuesProps) {
  return (
    // lg only: -mt-[140dvh] pulls Values up so its (sticky) title sits at the top WHILE
    // #intro is still pinned — the 03→04 handoff plays out on the fixed intro stage. Below
    // lg (tablet/mobile) there is no #intro, so Values keeps the plain flow (no overlap).
    <SectionLayer
      id="values"
      z={Z.values}
      regionVh={REGIONS.values}
      sectionClassName="lg:motion-safe:-mt-[140dvh]"
      growToContent
    >
      {/* data-values-cover: the crossfade fades this dark stage in over the fading intro. */}
      <div data-values-cover className="w-full" style={{ backgroundColor: DARK_BG }}>
        {/* Fluid two-column from md. max-w-[1200px] + md:px-6 matches the Showcase/Blog title
            grid so the Values title's left edge lines up with "SEED의 기반" / "SEED가 자라나는
            과정". py stays for tablet breathing room; it drops at lg (the card column's lead
            pad provides the desktop spacing). */}
        <div className="mx-auto w-full max-w-[1200px] px-[30px] py-[60px] md:flex md:gap-[64px] md:px-6 lg:py-0">
          {/* Left: the title, sticky from md. Tablet — pins at 110px (the 50px fixed header
              + a 60px gap) via `self-start` so the column is content-height and has room to
              stick; it releases as the section ends and 05 Showcase rises over it. Desktop
              (lg) — a full h-dvh column pinned at top:0, held in the upper third (pt-[180px])
              and revealed line-by-line during the 03→04 handoff. */}
          <div className="mb-[40px] md:sticky md:top-[110px] md:mb-0 md:flex md:h-fit md:w-[clamp(240px,25vw,300px)] md:shrink-0 md:items-start md:self-start lg:top-0 lg:h-dvh lg:pt-[180px]">
            <div data-values-title>
              {/* Mobile: one line at 28px. Desktop: keeps the two-line break + clamp scale. */}
              <RevealText
                as="h2"
                text={VALUES_TITLE.replace("\n", " ")}
                className="font-bold leading-[1.2] text-white text-[28px] md:hidden"
              />
              <RevealText
                as="h2"
                text={VALUES_TITLE}
                className="hidden font-bold leading-[1.08] text-white text-[clamp(32px,5vw,52px)] md:block"
              />
            </div>
          </div>

          {/* Right: scrolling list, flex-1 so it takes the remaining width (min-w-0 lets it
              shrink below the image's intrinsic size instead of overflowing). Cards are
              640px-capped and right-aligned (md:items-end) within that flex-1 column, so they
              hug the container's right edge with the slack falling on the left. Tablet uses a
              plain 50px gap and no lead pad — cards just fade in via createValuesReveal. At lg
              the tall gaps + lead/trail padding give each card a long dwell and time the first
              card's reveal to land just after the 04 title (createValuesReveal — first card
              `top 55%`, rest `top 80%`; pt and that trigger are a matched pair). All lg
              gaps/pads are motion-safe; motion-reduce collapses the pads to 14vh. */}
          <div className="flex flex-col gap-[50px] md:min-w-0 md:flex-1 md:items-end lg:gap-[24vh] lg:motion-safe:pb-[40vh] lg:motion-reduce:pb-[14vh] lg:motion-safe:pt-[95dvh] lg:motion-reduce:pt-[14vh]">
            {VALUE_CARDS.map((card, index) => (
              <article
                key={card.title}
                data-value-card
                className="flex w-full max-w-[640px] flex-col gap-[18px] md:gap-[34px]"
              >
                {/* Wrappers kept for createValuesReveal's selectors. The 16:9 motion
                    (webp poster → scroll-scrubbed Lottie) lives in ValueMotion; its
                    frames are driven by createValuesScrub as the card enters. */}
                <div data-value-image className="w-full">
                  <div data-value-image-inner>
                    <ValueMotion
                      webp={card.image}
                      lottie={card.lottie}
                      motionEnabled={motionEnabled}
                      onReady={(controller) => onValueLottieReady?.(index, controller)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[8px] md:gap-[16px]">
                  <RevealText
                    as="h3"
                    text={card.title}
                    className="font-medium text-white text-[22px] leading-[1.4] md:text-[32px] md:leading-[42px]"
                  />
                  <RevealText
                    text={card.description}
                    className="text-[16px] font-normal leading-[1.5] text-palette-gray-600 md:text-[20px] md:leading-[27px] md:text-white/70"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}

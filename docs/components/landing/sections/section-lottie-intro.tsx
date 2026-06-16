import { ScrubLottie } from "../components/scrub-lottie";
import type { LottieController } from "../components/scrub-lottie";
import {
  DARK_BG,
  INTRO_DESCRIPTION,
  INTRO_TITLE,
  LOTTIE,
  REGIONS,
  Z,
} from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

interface SectionLottieIntroProps {
  /** When set, the background Lottie is scrubbed by scroll instead of autoplaying. */
  onLottieReady?: (controller: LottieController) => void;
}

/**
 * Section 3 — Intro.
 * Dark stage with a background-filling Lottie (scrubbed by scroll) and a title +
 * description that fade in. Revealed from underneath as the bento lifts away.
 */
export function SectionLottieIntro({ onLottieReady }: SectionLottieIntroProps) {
  return (
    <SectionLayer id="intro" z={Z.intro} regionVh={REGIONS.intro}>
      <div
        className="relative flex h-full w-full items-center"
        style={{ backgroundColor: DARK_BG }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-60" data-intro-lottie>
          <ScrubLottie
            src={LOTTIE.intro}
            autoplay={!onLottieReady}
            loop={!onLottieReady}
            onReady={onLottieReady}
            fill
            className="size-full"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div
          data-intro-content
          className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="whitespace-pre-line text-[clamp(36px,6vw,76px)] font-bold leading-[1.08] tracking-tight text-white">
            {INTRO_TITLE}
          </h2>
          <p className="max-w-[420px] whitespace-pre-line text-[clamp(15px,1.2vw,18px)] leading-relaxed text-white/70">
            {INTRO_DESCRIPTION}
          </p>
        </div>
      </div>
    </SectionLayer>
  );
}

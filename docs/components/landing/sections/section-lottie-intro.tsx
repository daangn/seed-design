"use client";

import { useEffect } from "react";
import { RevealText } from "../components/reveal-text";
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
  lottieEnabled: boolean;
  lottieMotionEnabled: boolean;
  /** When set, the background Lottie is scrubbed by scroll instead of autoplaying. */
  onLottieReady?: (controller: LottieController | null) => void;
}

/**
 * Section 3 — Intro.
 * Dark stage with a background-filling Lottie (scrubbed by scroll) and a title +
 * description that fade in. Revealed from underneath as the bento lifts away.
 */
export function SectionLottieIntro({
  lottieEnabled,
  lottieMotionEnabled,
  onLottieReady,
}: SectionLottieIntroProps) {
  useEffect(() => () => onLottieReady?.(null), [onLottieReady]);

  const autoplay = lottieMotionEnabled && !onLottieReady;

  return (
    <SectionLayer id="intro" z={Z.intro} regionVh={REGIONS.intro} panelClassName="bg-transparent">
      <div className="relative h-full overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* data-intro-fade: the intro foreground (Lottie + copy) fades out as ONE layer
            in createIntroValuesCrossfade, so the Lottie can never lag the text. The dark
            stage (background above) stays opaque underneath. */}
        <div data-intro-fade className="absolute inset-0 flex items-start pt-[180px]">
          <div aria-hidden="true" className="absolute inset-0" data-intro-lottie>
            {lottieEnabled && (
              <ScrubLottie
                key={autoplay ? "autoplay" : "static"}
                src={LOTTIE.intro}
                autoplay={autoplay}
                loop={autoplay}
                onReady={onLottieReady}
                fill
                className="size-full"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>

          <div
            data-intro-content
            className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-row items-start justify-between gap-10 px-6"
          >
            <div data-intro-title>
              <RevealText
                as="h1"
                text={INTRO_TITLE}
                className="text-[clamp(36px,6vw,52px)] font-bold leading-[1.08] tracking-tight text-white"
              />
            </div>
            <div data-intro-description>
              <RevealText
                as="p"
                text={INTRO_DESCRIPTION}
                className="max-w-[600px] text-[22px] font-medium leading-relaxed text-white/70"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}

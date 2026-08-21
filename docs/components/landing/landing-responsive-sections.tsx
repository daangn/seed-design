import type { LottieController } from "./components/scrub-lottie";
import { INTRO_TITLE } from "./lib/landing-content";
import type { LandingLayout } from "./lib/landing-environment";
import { SectionBento } from "./sections/section-bento";
import { SectionHero } from "./sections/section-hero";
import { SectionLottieIntro } from "./sections/section-lottie-intro";

interface LandingResponsiveSectionsProps {
  environmentResolved: boolean;
  layout: LandingLayout;
  onLottieReady?: (controller: LottieController | null) => void;
  prefersReducedMotion: boolean;
}

export function LandingResponsiveSections({
  environmentResolved,
  layout,
  onLottieReady,
  prefersReducedMotion,
}: LandingResponsiveSectionsProps) {
  const lottieMotionEnabled = environmentResolved && !prefersReducedMotion;

  return (
    <>
      <SectionHero prefersReducedMotion={prefersReducedMotion} resolved={environmentResolved} />
      {layout === "mobile" ? (
        <SectionBento
          lottieEnabled={environmentResolved}
          lottieMotionEnabled={lottieMotionEnabled}
          mode="compact"
          mp4PlaybackEnabled={lottieMotionEnabled}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <>
          {layout === "tablet" && <h1 className="sr-only">{INTRO_TITLE.replace(/\n/g, " ")}</h1>}
          <SectionBento
            lottieEnabled={environmentResolved}
            lottieMotionEnabled={lottieMotionEnabled}
            mode="desktop"
            mp4PlaybackEnabled={lottieMotionEnabled}
            prefersReducedMotion={prefersReducedMotion}
          />
          {layout === "desktop" && (
            <SectionLottieIntro
              lottieEnabled={environmentResolved}
              lottieMotionEnabled={lottieMotionEnabled}
              onLottieReady={onLottieReady}
            />
          )}
        </>
      )}
    </>
  );
}

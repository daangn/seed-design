"use client";

import Image from "next/image";
import { ScrubLottie } from "./scrub-lottie";
import type { LottieController } from "./scrub-lottie";

interface ValueMotionProps {
  /** Static poster shown on mobile (< md), under reduced-motion, and no-JS (SSR). */
  webp: string;
  /** Scroll-scrubbed motion (driven by createValuesScrub via onReady). */
  lottie: string;
  /** True only for the md+ layout when the user allows motion. */
  motionEnabled: boolean;
  /** Hands the paused Lottie instance up so scroll can scrub its frames. */
  onReady: (controller: LottieController) => void;
}

/**
 * The 04 Values card visual: a fixed 16:9 box (matches the Lottie comp) that shows
 * the static `.webp` poster by default and swaps to the scroll-scrubbed `ScrubLottie`
 * only on the md+ two-column layout with motion allowed. Decorative (`aria-hidden`) —
 * meaning lives in the sibling h3 + p.
 *
 * The mobile one-column flow (< md), reduced-motion, and no-JS (SSR) all keep the
 * static webp — the player is `ssr:false`, so rendering webp first also keeps SSR
 * non-blank. createValuesScrub only runs at md+ and skips reduced-motion, so the scrub
 * and this swap stay in lockstep. LandingExperience resolves the layout and Reduced Motion
 * preference once, then passes the result down. The fixed-ratio box prevents layout shift.
 */
export function ValueMotion({ webp, lottie, motionEnabled, onReady }: ValueMotionProps) {
  return (
    <div
      aria-hidden
      className="relative aspect-[16/9] w-full overflow-hidden rounded-r2_5 md:rounded-r4"
    >
      {motionEnabled ? (
        <ScrubLottie src={lottie} fill onReady={onReady} className="absolute inset-0 size-full" />
      ) : (
        <Image
          src={webp}
          alt=""
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

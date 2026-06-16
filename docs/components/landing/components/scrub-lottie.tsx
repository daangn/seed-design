"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), {
  ssr: false,
});

/** Minimal slice of lottie-web's AnimationItem we drive from scroll. */
export interface LottieController {
  totalFrames: number;
  goToAndStop: (value: number, isFrame?: boolean) => void;
}

interface ScrubLottieProps {
  src: string;
  className?: string;
  style?: CSSProperties;
  /** Autoplay (sections 5/6). Leave false when scrubbing via `onReady`. */
  autoplay?: boolean;
  loop?: boolean;
  /** Cover (slice) instead of contain (meet) — fills the slot, may crop edges. */
  fill?: boolean;
  /** Receives the animation instance so a parent can scrub frames on scroll. */
  onReady?: (controller: LottieController) => void;
}

/**
 * Thin wrapper over the LottieFiles player. SSR-disabled (static export safe).
 * When `onReady` is supplied the animation stays paused and the caller scrubs
 * frames with `goToAndStop`; otherwise it autoplays.
 */
export function ScrubLottie({
  src,
  className,
  style,
  autoplay = false,
  loop = false,
  fill = false,
  onReady,
}: ScrubLottieProps) {
  return (
    // The player's own `.lf-player-container` sizes to the lottie's aspect ratio,
    // so it leaves a gap in a taller slot. The caller's className only reaches the
    // inner div, so wrap and force the container + svg to fill — preserveAspectRatio
    // (slice when `fill`) then covers within the now-filled box.
    <div
      className={`${className ?? ""} [&_.lf-player-container]:size-full [&_svg]:size-full!`.trim()}
    >
      <Player
        src={src}
        autoplay={autoplay}
        loop={loop}
        keepLastFrame
        rendererSettings={{ preserveAspectRatio: fill ? "xMidYMid slice" : "xMidYMid meet" }}
        className="size-full"
        style={style}
        lottieRef={(instance: LottieController) => {
          onReady?.(instance);
        }}
      />
    </div>
  );
}

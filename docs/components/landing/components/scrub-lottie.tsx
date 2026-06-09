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
  onReady,
}: ScrubLottieProps) {
  return (
    <Player
      src={src}
      autoplay={autoplay}
      loop={loop}
      keepLastFrame
      className={className}
      style={style}
      lottieRef={(instance: LottieController) => {
        onReady?.(instance);
      }}
    />
  );
}

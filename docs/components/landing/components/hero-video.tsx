"use client";

import {
  IconTriangleRightFill,
  IconVertrectangle2HorizontalFill,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { useLandingMp4Playback } from "../lib/use-landing-mp4-playback";
import { ManagedVideo, type ManagedVideoSource } from "./managed-video";

interface HeroVideoProps {
  prefersReducedMotion: boolean;
  resolved: boolean;
  poster: string;
  src?: string;
  sources?: ManagedVideoSource[];
  wrapperClassName?: string;
  videoClassName?: string;
  /** Position utilities for the overlay button, e.g. "bottom-4 right-4". */
  buttonClassName?: string;
}

/**
 * The hero intro video with its own play/pause control. Unlike the bento videos
 * (which just autoplay), the hero owns a manual toggle whose button surfaces the
 * moment the page scrolls off the very top — so the first, unscrolled impression is
 * uninterrupted motion.
 * Reused by the desktop hero (SectionHero) and the mobile hero (CompactBento); the
 * caller supplies the `relative` container the absolute button anchors to.
 */
export function HeroVideo({
  prefersReducedMotion,
  resolved,
  poster,
  src,
  sources,
  wrapperClassName,
  videoClassName,
  buttonClassName,
}: HeroVideoProps) {
  const { playbackEnabled, setPlaybackEnabled } = useLandingMp4Playback({
    prefersReducedMotion,
    resolved,
  });
  const [scrolled, setScrolled] = useState(false);
  // Reveal the control the moment the page leaves the very top (same >8px threshold as
  // the header collapse) — or immediately under reduced-motion, where the video never
  // autoplays (so there's always a way to start it). Lenis drives the real document
  // scroll, so a passive window listener is enough for this coarse one-way reveal.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const controlsVisible = scrolled || prefersReducedMotion;

  return (
    <>
      <ManagedVideo
        playbackEnabled={playbackEnabled}
        poster={poster}
        src={src}
        sources={sources}
        wrapperClassName={wrapperClassName}
        className={videoClassName}
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <PlaybackButton
        playing={playbackEnabled}
        visible={controlsVisible}
        onToggle={() => setPlaybackEnabled(!playbackEnabled)}
        className={buttonClassName}
      />
    </>
  );
}

function PlaybackButton({
  playing,
  visible,
  onToggle,
  className,
}: {
  playing: boolean;
  visible: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const label = playing ? "동영상 일시정지" : "동영상 재생";
  const PlaybackIcon = playing ? IconVertrectangle2HorizontalFill : IconTriangleRightFill;

  // The wrapper owns position + reveal; the SEED ActionButton (neutralWeak, iconOnly) owns
  // the button styling. Transition opacity AND visibility so the reveal actually fades in —
  // opacity alone pops here because the resting state is `invisible` (visibility:hidden, which
  // keeps the hidden control out of the focus / a11y tree) and browsers skip the opacity
  // animation coming out of it. Absolute + only right/bottom insets → the wrapper shrink-wraps
  // the button.
  return (
    <div
      className={clsx(
        "absolute z-10 transition-[opacity,visibility] duration-300",
        visible ? "opacity-100" : "pointer-events-none invisible opacity-0",
        className,
      )}
    >
      <ActionButton
        variant="neutralWeak"
        layout="iconOnly"
        size="small"
        // Force a full circle: `size=small` iconOnly is a square (x9×x9) but the recipe
        // rounds it to radius-r2 (a chip). Inline style beats the recipe class.
        style={{
          borderRadius: "var(--seed-radius-full)",
          backgroundColor: "var(--seed-color-palette-static-white-alpha-500)",
        }}
        aria-label={label}
        aria-pressed={playing}
        onClick={onToggle}
      >
        <Icon svg={<PlaybackIcon />} />
      </ActionButton>
    </div>
  );
}

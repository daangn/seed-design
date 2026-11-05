"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Fragment, type FocusEvent, type ReactNode, useRef } from "react";

export interface InfiniteCarouselRenderContext {
  isDuplicate: boolean;
}

interface InfiniteCarouselProps<T> {
  items: T[];
  /** Render one item with context about whether it belongs to the duplicated copy. */
  renderItem: (item: T, index: number, context: InfiniteCarouselRenderContext) => ReactNode;
  /** Visual travel direction. "right" = items drift rightward. */
  direction?: "left" | "right";
  /** Seconds for one full loop. */
  speed?: number;
  /** Gap between items (Tailwind gap class). */
  gapClassName?: string;
  className?: string;
  motionEnabled?: boolean;
}

/**
 * Seamless marquee: the animated track holds two identical copies and loops via GSAP.
 * Without motion the duplicate copy is dropped and the track becomes horizontally
 * scrollable, so every item stays pointer- and keyboard-accessible with no visible
 * duplicates (and no doubled image loads). Auto-cleans on unmount.
 */
export function InfiniteCarousel<T>({
  items,
  renderItem,
  direction = "left",
  speed = 40,
  gapClassName = "gap-5",
  className,
  motionEnabled = true,
}: InfiniteCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const focusWithinRef = useRef(false);
  const hoverRef = useRef(false);
  const originalCopy = motionEnabled && direction === "right" ? 1 : 0;

  const { contextSafe } = useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || !motionEnabled) return;

      const from = direction === "right" ? -50 : 0;
      const to = direction === "right" ? 0 : -50;
      tweenRef.current = gsap.fromTo(
        track,
        { xPercent: from },
        { xPercent: to, duration: speed, ease: "none", repeat: -1 },
      );
      if (focusWithinRef.current) tweenRef.current.pause();

      return () => {
        tweenRef.current = null;
      };
    },
    {
      scope: rootRef,
      dependencies: [direction, motionEnabled, speed],
      revertOnUpdate: true,
    },
  );

  // Slow the marquee while hovered, restore on leave (no-op under reduced-motion).
  const setTimeScale = contextSafe((value: number) => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, {
      timeScale: value,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  });

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !(event.target instanceof Element) ||
      !event.target.closest('[data-carousel-copy="original"]')
    ) {
      return;
    }

    focusWithinRef.current = true;
    tweenRef.current?.pause();
    if (event.target.matches(":focus-visible")) {
      event.target.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      event.relatedTarget instanceof Element &&
      event.currentTarget.contains(event.relatedTarget) &&
      event.relatedTarget.closest('[data-carousel-copy="original"]')
    ) {
      return;
    }

    focusWithinRef.current = false;
    const tween = tweenRef.current;
    if (!tween) return;
    if (rootRef.current) rootRef.current.scrollLeft = 0;
    tween.play();
    setTimeScale(hoverRef.current ? 0.2 : 1);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: delegates decorative motion changes from descendant links.
    <div
      ref={rootRef}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onMouseEnter={() => {
        hoverRef.current = true;
        setTimeScale(0.2);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        setTimeScale(1);
      }}
      onTouchStart={() => setTimeScale(0.2)}
      onTouchEnd={() => setTimeScale(1)}
      className={`w-full max-w-full [contain:paint] ${
        motionEnabled ? "overflow-hidden" : "overflow-x-auto overflow-y-hidden"
      } ${className ?? ""}`}
    >
      <div ref={trackRef} data-carousel-track className={`flex w-max ${gapClassName}`}>
        {(motionEnabled ? [0, 1] : [0]).map((copy) => (
          <div
            key={copy}
            data-carousel-copy={copy === originalCopy ? "original" : "duplicate"}
            aria-hidden={copy !== originalCopy}
            className={`flex shrink-0 ${gapClassName}`}
          >
            {items.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: each duplicated static item list keeps its order.
              <Fragment key={index}>
                {renderItem(item, index, { isDuplicate: copy !== originalCopy })}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

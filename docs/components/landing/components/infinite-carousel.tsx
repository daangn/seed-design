"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Fragment, type ReactNode, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "../lib/landing-content";

interface InfiniteCarouselProps<T> {
  items: T[];
  /** Must return an element with a stable `key`. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Visual travel direction. "right" = items drift rightward. */
  direction?: "left" | "right";
  /** Seconds for one full loop. */
  speed?: number;
  /** Gap between items (Tailwind gap class). */
  gapClassName?: string;
  className?: string;
}

/**
 * Seamless marquee: the track holds two identical copies and loops via GSAP.
 * Respects prefers-reduced-motion (stays static). Auto-cleans on unmount.
 */
export function InfiniteCarousel<T>({
  items,
  renderItem,
  direction = "left",
  speed = 40,
  gapClassName = "gap-5",
  className,
}: InfiniteCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

      const from = direction === "right" ? -50 : 0;
      const to = direction === "right" ? 0 : -50;
      gsap.fromTo(
        track,
        { xPercent: from },
        { xPercent: to, duration: speed, ease: "none", repeat: -1 },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className={`flex w-max ${gapClassName}`}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className={`flex shrink-0 ${gapClassName}`}>
            {items.map((item, index) => (
              <Fragment key={index}>{renderItem(item, index)}</Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

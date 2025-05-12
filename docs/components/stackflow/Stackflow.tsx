"use client";

import { useSimpleReveal } from "simple-reveal";

import { makeStack } from "./Stack";

import type { RegisteredActivityName } from "@stackflow/config";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useEffect, useState } from "react";
import type * as React from "react";

const usePreventScroll = (ref: React.RefObject<HTMLElement>) => {
  const [isTouchInside, setIsTouchInside] = useState(false);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (ref.current?.contains(event.target as Node)) {
        setIsTouchInside(true);
      } else {
        setIsTouchInside(false);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isTouchInside) {
        // Prevent scrolling the page
        event.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, isTouchInside]);
};

interface StackflowProps {
  activities: {
    name: RegisteredActivityName;
    component: ActivityComponentType<RegisteredActivityName>;
  }[];
}

export const Stackflow = ({ activities }: StackflowProps) => {
  const { Stack } = makeStack({ activities });
  const { cn, ref, style } = useSimpleReveal({
    delay: 200,
    rootMargin: "-200px",
    initialTransform: "scale(0.95)",
  });

  usePreventScroll(ref);

  return (
    <div
      ref={ref}
      className={cn("not-prose")}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "3rem 0",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          height: "640px",
          position: "relative",
          borderRadius: ".5rem",
          overflow: "hidden",
          transform: "translate3d(0, 0, 0)",
          maskImage: "-webkit-radial-gradient(white, black)",
          boxShadow: "0 .25rem 1rem 0 rgba(0, 0, 0, .1)",
          border: "1px solid var(--seed-semantic-color-divider-1)",
        }}
      >
        <Stack />
      </div>
    </div>
  );
};

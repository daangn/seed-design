"use client";

import { useSimpleReveal } from "simple-reveal";

import { makeStack } from "./Stack";

import type { RegisteredActivityName } from "@stackflow/config";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useEffect, useState } from "react";
import type * as React from "react";
import { Box, Flex } from "@ride-developer/react";

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
    <Flex
      position="relative"
      width="full"
      justify="center"
      ref={ref}
      className={cn("not-prose example-reset")}
      style={{ margin: "3rem 0", ...style }}
    >
      <Box
        width="full"
        maxWidth="360px"
        height="640px"
        position="relative"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        borderRadius="r2"
        overflowX="hidden"
        overflowY="hidden"
        style={{
          transform: "translate3d(0, 0, 0)",
          maskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        <Stack />
      </Box>
    </Flex>
  );
};

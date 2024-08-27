import * as React from "react";

import { type FullGestureState, useGesture } from "@use-gesture/react";

interface UseSwipeableStateProps {
  /**
   * tab swipe 기능 활성화 여부
   * @default true
   */
  isSwipeable?: boolean;
}

const useSwipeableState = (props: UseSwipeableStateProps) => {
  const { isSwipeable } = props;
  const [swipeStatus, setSwipeStatus] = React.useState<"idle" | "dragging">("idle");
  const [swipeMoveX, setSwipeMoveX] = React.useState<number>(0);

  return {
    swipeStatus,
    swipeMoveX,
    onDrag: (
      state: Omit<FullGestureState<"drag">, "event"> & {
        event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
      },
    ) => {
      if (!isSwipeable) return;

      setSwipeMoveX(state.movement[0]);
    },
    onDragStart: () => {
      if (!isSwipeable) return;

      setSwipeStatus("dragging");
    },
    onDragEnd: () => {
      if (!isSwipeable) return;

      setSwipeStatus("idle");
      setSwipeMoveX(0);
    },
  };
};

export type Vector2 = [number, number];

export interface UseSwipeableProps extends UseSwipeableStateProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;

  swipeConfig?: {
    /**
     * @default 0.3
     * The minimum velocity per axis (in pixels / ms) the drag gesture needs to
     * reach before the pointer is released.
     */
    velocity?: number | Vector2;
    /**
     * @default 50
     * The minimum distance per axis (in pixels) the drag gesture needs to
     * travel to trigger a swipe. Defaults to 50.
     */
    distance?: number | Vector2;
    /**
     * @default 250
     * The maximum duration in milliseconds that a swipe is detected. Defaults
     * to 250.
     */
    duration?: number;
  };
}

export const useSwipeable = (props: UseSwipeableProps) => {
  const { isSwipeable = true, swipeConfig, onSwipeLeft, onSwipeRight } = props;

  const { onDrag, onDragEnd, onDragStart, swipeMoveX, swipeStatus } = useSwipeableState({
    isSwipeable,
  });

  const getDragProps = useGesture(
    {
      onDragStart,

      onDragEnd: ({ swipe: [swipeX] }) => {
        if (!isSwipeable) return;

        if (swipeX === -1) onSwipeRight?.();
        if (swipeX === 1) onSwipeLeft?.();

        onDragEnd();
      },

      onDrag,
    },
    {
      drag: {
        preventScrollAxis: "y",
        preventDefault: true,
        swipe: {
          distance: swipeConfig?.distance || 50,
          velocity: swipeConfig?.velocity || 0.3,
          duration: swipeConfig?.duration || 250,
        },
      },
    },
  );

  return {
    swipeMoveX,
    swipeStatus,
    getDragProps,
  };
};

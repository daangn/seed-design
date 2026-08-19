import { useEffect, useLayoutEffect, useRef } from "react";
import { cancelAll } from "../private/waapi";
import { allAnimations, getScreenMotion, NO_ANIMATIONS, playScreenMotion } from "./animation";
import type { NextAppScreenTransitionStyle, NextScreenState } from "./types";

export interface UseNextScreenTransitionArgs {
  screenState: NextScreenState;
  transitionStyle: NextAppScreenTransitionStyle;
  rootRef: React.RefObject<HTMLElement | null>;
  layerRef: React.RefObject<HTMLElement | null>;
  dimRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
}

/**
 * Drives this screen's enter/exit/behind motion with WAAPI, keyed off the
 * `data-screen-state` React already derived.
 *
 * The effect is a layout effect so the animation is registered in the same
 * commit that flipped the attribute — the first paint then lands on the
 * animation's start keyframe, with no flash at the resting position and no
 * need to defer a frame.
 */
export function useNextScreenTransition({
  screenState,
  transitionStyle,
  rootRef,
  layerRef,
  dimRef,
  contentRef,
}: UseNextScreenTransitionArgs) {
  const runningRef = useRef(NO_ANIMATIONS);

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    // A gesture owns these elements for its whole life, release included — and
    // that covers the `pop` a consumer fires on `swiped: true`, whose exit the
    // finger has already performed.
    if (rootEl.dataset["swipeBackState"] !== undefined) return;

    const motion = getScreenMotion(transitionStyle, screenState);

    // A resting state leaves a running animation alone. Every motion ends on
    // the value the state that follows it rests at, so letting it play out is
    // what keeps an enter tolerant of a `transitionDuration` shorter than the
    // motion — cutting it here would snap the screen into place instead.
    if (!motion) return;

    // Sample before cancelling: an in-flight animation is what the computed
    // style reports, and cancelling drops it back to the declared position.
    const previous = runningRef.current;
    const animations = playScreenMotion(
      { layer: layerRef.current, dim: dimRef.current, content: contentRef.current },
      motion,
      previous,
    );
    cancelAll(allAnimations(previous));
    runningRef.current = animations;
  }, [screenState, transitionStyle, rootRef, layerRef, dimRef, contentRef]);

  // Never leave an animation running against a torn-down screen.
  useEffect(() => () => cancelAll(allAnimations(runningRef.current)), []);
}

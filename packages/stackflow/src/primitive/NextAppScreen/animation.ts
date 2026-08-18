/**
 * WAAPI motion for NextAppScreen.
 *
 * Division of labour with the recipe (`next-app-screen` in qvism-preset): the
 * recipe declares where every `data-screen-state` and `data-swipe-back-state`
 * *rests*, this module declares how to travel there. Consequently every
 * animation below ends exactly on the CSS value of the state it runs inside,
 * which is why they all use `fill: "none"` — an animation that is cancelled,
 * times out, or never runs at all (no WAAPI) degrades to the declared resting
 * position instead of stranding the screen mid-transition.
 *
 * That also means the positions here are a second copy of the recipe's. Change
 * one without the other and the animation lands somewhere the CSS doesn't hold.
 */

import { isPlaying, safeAnimate, sampleKeyframe } from "../private/waapi";
import type { NextAppScreenTransitionStyle, NextScreenState } from "./types";

// ─── Positions (mirror of the recipe) ───────────────────────────────────────

const RESTING = "translate3d(0, 0, 0)";
const OFFSCREEN_X = "translate3d(100%, 0, 0)";

/** Behind layer park position while a horizontalSlide top covers it. */
const BEHIND_OFFSET_PERCENT = -30;
const BEHIND_X = `translate3d(${BEHIND_OFFSET_PERCENT}%, 0, 0)`;

const VERTICAL_LAYER_Y = "translate3d(0, 8vh, 0)";
const VERTICAL_DIM_Y = "translate3d(0, -8vh, 0)";

// ─── Timings ────────────────────────────────────────────────────────────────

// approximates iOS spring animation
const HORIZONTAL = { duration: 350, easing: "cubic-bezier(0.2, 0.1, 0.21, 0.99)" };

// approximates Easing.out(Easing.poly(5))
const VERTICAL_ENTER = { duration: 300, easing: "cubic-bezier(0.23, 0.1, 0.32, 1)" };
const VERTICAL_EXIT = { duration: 150, easing: "linear" };

const CROSSFADE_ENTER = { duration: 300, easing: "ease-out" };
const CROSSFADE_EXIT = { duration: 150, easing: "ease-in" };

/**
 * The release leg of a swipe back always follows the horizontalSlide curve —
 * the gesture only exists for that style.
 */
export const SWIPE_RELEASE = HORIZONTAL;

export interface ScreenMotion {
  duration: number;
  easing: string;
  layer?: readonly [Keyframe, Keyframe];
  dim?: readonly [Keyframe, Keyframe];
}

/**
 * `null` means the state has no motion of its own: the resting states, and the
 * behind states of the styles whose behind screen simply stays put.
 */
const SCREEN_MOTION = {
  horizontalSlide: {
    push: {
      ...HORIZONTAL,
      layer: [{ transform: OFFSCREEN_X }, { transform: RESTING }],
      dim: [{ opacity: "0" }, { opacity: "1" }],
    },
    pop: {
      ...HORIZONTAL,
      layer: [{ transform: RESTING }, { transform: OFFSCREEN_X }],
      dim: [{ opacity: "1" }, { opacity: "0" }],
    },
    "push-behind": {
      ...HORIZONTAL,
      layer: [{ transform: RESTING }, { transform: BEHIND_X }],
    },
    "pop-behind": {
      ...HORIZONTAL,
      layer: [{ transform: BEHIND_X }, { transform: RESTING }],
    },
    idle: null,
    "idle-behind": null,
  },
  verticalSlide: {
    push: {
      ...VERTICAL_ENTER,
      layer: [
        { opacity: "0", transform: VERTICAL_LAYER_Y },
        { opacity: "1", transform: RESTING },
      ],
      dim: [
        { opacity: "0", transform: VERTICAL_DIM_Y },
        { opacity: "1", transform: RESTING },
      ],
    },
    pop: {
      ...VERTICAL_EXIT,
      layer: [
        { opacity: "1", transform: RESTING },
        { opacity: "0", transform: VERTICAL_LAYER_Y },
      ],
      dim: [
        { opacity: "1", transform: RESTING },
        { opacity: "0", transform: VERTICAL_DIM_Y },
      ],
    },
    "push-behind": null,
    "pop-behind": null,
    idle: null,
    "idle-behind": null,
  },
  crossfade: {
    push: {
      ...CROSSFADE_ENTER,
      layer: [{ opacity: "0" }, { opacity: "1" }],
    },
    pop: {
      ...CROSSFADE_EXIT,
      layer: [{ opacity: "1" }, { opacity: "0" }],
    },
    "push-behind": null,
    "pop-behind": null,
    idle: null,
    "idle-behind": null,
  },
} as const satisfies Record<
  NextAppScreenTransitionStyle,
  Record<NextScreenState, ScreenMotion | null>
>;

export const getScreenMotion = (
  style: NextAppScreenTransitionStyle,
  state: NextScreenState,
): ScreenMotion | null => SCREEN_MOTION[style][state];

export interface ScreenElements {
  layer: HTMLElement | null;
  dim: HTMLElement | null;
}

/** What each slot is currently playing, so the next motion can depart from it. */
export interface ScreenAnimations {
  layer: Animation | null;
  dim: Animation | null;
}

export const NO_ANIMATIONS: ScreenAnimations = { layer: null, dim: null };

/**
 * Start this state's motion on every slot that has one. Where the slot is
 * still mid-flight the start keyframe is re-read from the live computed style,
 * so an interrupted transition picks up where the screen actually is rather
 * than jumping back to the declared start.
 */
export function playScreenMotion(
  elements: ScreenElements,
  motion: ScreenMotion,
  previous: ScreenAnimations,
): ScreenAnimations {
  const options: KeyframeAnimationOptions = {
    duration: motion.duration,
    easing: motion.easing,
    fill: "none",
  };

  const play = (
    el: HTMLElement | null,
    frames: readonly [Keyframe, Keyframe] | undefined,
    running: Animation | null,
  ) => {
    if (!el || !frames) return null;

    const from = isPlaying(running) ? sampleKeyframe(el, frames[0]) : frames[0];
    return safeAnimate(el, [from, frames[1]], options);
  };

  return {
    layer: play(elements.layer, motion.layer, previous.layer),
    dim: play(elements.dim, motion.dim, previous.dim),
  };
}

// ─── Swipe back release ─────────────────────────────────────────────────────

export interface SwipeElements extends ScreenElements {
  behindLayer: HTMLElement | null;
}

/**
 * Animate a released gesture from wherever the finger left it to the resting
 * position of the state it releases into — `completing` (top offscreen, behind
 * onscreen) or `canceling` (top back onscreen, behind parked again).
 *
 * The start keyframes are computed from `displacement` rather than sampled,
 * because they are the exact values the drag was writing through the CSS
 * variables up to this very frame.
 */
export function playSwipeRelease(
  elements: SwipeElements,
  displacement: number,
  mode: "cancel" | "complete",
) {
  const ratio = displacement / window.innerWidth;
  const options: KeyframeAnimationOptions = {
    duration: SWIPE_RELEASE.duration,
    easing: SWIPE_RELEASE.easing,
    fill: "none",
  };

  const completing = mode === "complete";

  return [
    safeAnimate(
      elements.layer,
      [
        { transform: `translate3d(${displacement}px, 0, 0)` },
        { transform: completing ? OFFSCREEN_X : RESTING },
      ],
      options,
    ),
    safeAnimate(
      elements.dim,
      [{ opacity: `${1 - ratio}` }, { opacity: completing ? "0" : "1" }],
      options,
    ),
    safeAnimate(
      elements.behindLayer,
      [
        {
          transform: `translate3d(calc(${BEHIND_OFFSET_PERCENT}% + ${ratio} * ${-BEHIND_OFFSET_PERCENT}%), 0, 0)`,
        },
        { transform: completing ? RESTING : BEHIND_X },
      ],
      options,
    ),
  ].filter((a): a is Animation => a !== null);
}

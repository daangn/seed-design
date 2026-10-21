/**
 * WAAPI motion for NextAppScreen.
 *
 * Division of labour with the recipe (`next-app-screen` in qvism-preset): the
 * recipe declares where every `data-screen-state` and `data-swipe-back-state`
 * *rests*, this module declares how to travel there. Consequently every
 * animation below ends exactly on the CSS value of the state it runs inside,
 * which is why none of them fills forwards — an animation that is cancelled,
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

const VERTICAL_LAYER_OFFSET = "8vh";
const VERTICAL_LAYER_Y = `translate3d(0, ${VERTICAL_LAYER_OFFSET}, 0)`;

// ─── Timings ────────────────────────────────────────────────────────────────

// approximates iOS spring animation
const HORIZONTAL = { duration: 350, easing: "cubic-bezier(0.2, 0.1, 0.21, 0.99)" };

// approximates Easing.out(Easing.poly(5))
const VERTICAL_ENTER = { duration: 300, easing: "cubic-bezier(0.23, 0.1, 0.32, 1)" };
const VERTICAL_EXIT = { duration: 150, easing: "linear" };

const CROSSFADE_ENTER = { duration: 300, easing: "ease-out" };
const CROSSFADE_EXIT = { duration: 150, easing: "ease-in" };

/**
 * One animation on a slot. Slots are lists of these, so a slot whose
 * properties move on different schedules declares one per property group
 * rather than folding them into shared keyframe offsets.
 */
interface SlotMotion {
  duration: number;
  easing: string;
  keyframes: readonly [Keyframe, Keyframe];
}

export interface ScreenMotion {
  layer?: readonly SlotMotion[];
  dim?: readonly SlotMotion[];
}

/**
 * `null` means the state has no motion of its own: the resting states, and the
 * behind states of the styles whose behind screen simply stays put.
 */
const SCREEN_MOTION = {
  horizontalSlide: {
    push: {
      layer: [{ ...HORIZONTAL, keyframes: [{ transform: OFFSCREEN_X }, { transform: RESTING }] }],
      dim: [{ ...HORIZONTAL, keyframes: [{ opacity: "0" }, { opacity: "1" }] }],
    },
    pop: {
      layer: [{ ...HORIZONTAL, keyframes: [{ transform: RESTING }, { transform: OFFSCREEN_X }] }],
      dim: [{ ...HORIZONTAL, keyframes: [{ opacity: "1" }, { opacity: "0" }] }],
    },
    "push-behind": {
      layer: [{ ...HORIZONTAL, keyframes: [{ transform: RESTING }, { transform: BEHIND_X }] }],
    },
    "pop-behind": {
      layer: [{ ...HORIZONTAL, keyframes: [{ transform: BEHIND_X }, { transform: RESTING }] }],
    },
    idle: null,
    "idle-behind": null,
  },
  verticalSlide: {
    push: {
      layer: [
        {
          ...VERTICAL_ENTER,
          keyframes: [
            { opacity: "0", transform: VERTICAL_LAYER_Y },
            { opacity: "1", transform: RESTING },
          ],
        },
      ],
      dim: [{ ...VERTICAL_ENTER, keyframes: [{ opacity: "0" }, { opacity: "1" }] }],
    },
    pop: {
      layer: [
        {
          ...VERTICAL_EXIT,
          keyframes: [
            { opacity: "1", transform: RESTING },
            { opacity: "0", transform: VERTICAL_LAYER_Y },
          ],
        },
      ],
      dim: [{ ...VERTICAL_EXIT, keyframes: [{ opacity: "1" }, { opacity: "0" }] }],
    },
    "push-behind": null,
    "pop-behind": null,
    idle: null,
    "idle-behind": null,
  },
  crossfade: {
    push: {
      layer: [{ ...CROSSFADE_ENTER, keyframes: [{ opacity: "0" }, { opacity: "1" }] }],
    },
    pop: {
      layer: [{ ...CROSSFADE_EXIT, keyframes: [{ opacity: "1" }, { opacity: "0" }] }],
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
  layer: Animation[];
  dim: Animation[];
}

export const NO_ANIMATIONS: ScreenAnimations = { layer: [], dim: [] };

export const allAnimations = ({ layer, dim }: ScreenAnimations) => [...layer, ...dim];

/**
 * Start this state's motion on every slot that has one. Where the slot is
 * still mid-flight every leg's start keyframe is re-read from the live
 * computed style, so an interrupted transition picks up where the screen
 * actually is rather than jumping back to the declared start.
 */
export function playScreenMotion(
  elements: ScreenElements,
  motion: ScreenMotion,
  previous: ScreenAnimations,
): ScreenAnimations {
  const play = (
    el: HTMLElement | null,
    motions: readonly SlotMotion[] | undefined,
    running: Animation[],
  ) => {
    if (!el || !motions) return [];

    const interrupted = running.some(isPlaying);
    return motions
      .map((slotMotion) => {
        const [from, to] = slotMotion.keyframes;
        return safeAnimate(el, [interrupted ? sampleKeyframe(el, from) : from, to], {
          duration: slotMotion.duration,
          easing: slotMotion.easing,
          fill: "none",
        });
      })
      .filter((animation): animation is Animation => animation !== null);
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
 * One property group's part in a gesture. `at` is a mirror of the recipe's
 * `swiping` rule with the ratio the CSS variable was carrying substituted in,
 * so a release departs from exactly the value the drag left on screen; `cancel`
 * and `complete` are the resting positions of the two states it can release
 * into.
 */
interface SwipeSlotMotion {
  at: (ratio: number, displacement: number) => Keyframe;
  cancel: Keyframe;
  complete: Keyframe;
}

interface SwipeMotion {
  /**
   * A completed gesture finishes the screen's exit, a cancelled one undoes it —
   * so each leg borrows the timing of the transition it stands in for.
   */
  timing: Record<"cancel" | "complete", { duration: number; easing: string }>;
  layer: readonly SwipeSlotMotion[];
  dim: readonly SwipeSlotMotion[];
  behindLayer: readonly SwipeSlotMotion[];
}

const fadeOut = (ratio: number) => ({ opacity: `${1 - ratio}` });

/**
 * The gesture drives the same path the style's own exit takes, scrubbed by how
 * far the finger has travelled. An empty list marks a slot the style leaves
 * alone, so a release never animates an element the CSS holds still —
 * crossfade's dim is `display: none`, and only the horizontal styles move the
 * screen behind.
 */
const SWIPE_MOTION = {
  horizontalSlide: {
    timing: { cancel: HORIZONTAL, complete: HORIZONTAL },
    layer: [
      {
        // px rather than a ratio: the top layer tracks the finger 1:1.
        at: (_ratio, displacement) => ({
          transform: `translate3d(${displacement}px, 0, 0)`,
        }),
        cancel: { transform: RESTING },
        complete: { transform: OFFSCREEN_X },
      },
    ],
    dim: [
      {
        at: fadeOut,
        cancel: { opacity: "1" },
        complete: { opacity: "0" },
      },
    ],
    behindLayer: [
      {
        at: (ratio) => ({
          transform: `translate3d(calc(${BEHIND_OFFSET_PERCENT}% + ${ratio} * ${-BEHIND_OFFSET_PERCENT}%), 0, 0)`,
        }),
        cancel: { transform: BEHIND_X },
        complete: { transform: RESTING },
      },
    ],
  },
  verticalSlide: {
    timing: { cancel: VERTICAL_ENTER, complete: VERTICAL_EXIT },
    layer: [
      {
        at: (ratio) => ({
          opacity: `${1 - ratio}`,
          transform: `translate3d(0, calc(${ratio} * ${VERTICAL_LAYER_OFFSET}), 0)`,
        }),
        cancel: { opacity: "1", transform: RESTING },
        complete: { opacity: "0", transform: VERTICAL_LAYER_Y },
      },
    ],
    dim: [
      {
        at: fadeOut,
        cancel: { opacity: "1" },
        complete: { opacity: "0" },
      },
    ],
    behindLayer: [],
  },
  crossfade: {
    timing: { cancel: CROSSFADE_ENTER, complete: CROSSFADE_EXIT },
    layer: [
      {
        at: fadeOut,
        cancel: { opacity: "1" },
        complete: { opacity: "0" },
      },
    ],
    dim: [],
    behindLayer: [],
  },
} as const satisfies Record<NextAppScreenTransitionStyle, SwipeMotion>;

/**
 * Animate a released gesture from wherever the finger left it to the resting
 * position of the state it releases into — `completing` (the screen's exit,
 * finished) or `canceling` (the screen back where it started).
 *
 * Returns the duration alongside the animations so the caller can time the
 * settle without looking the style's timing up a second time.
 */
export function playSwipeRelease(
  elements: SwipeElements,
  style: NextAppScreenTransitionStyle,
  displacement: number,
  mode: "cancel" | "complete",
) {
  const motion = SWIPE_MOTION[style];
  const { duration, easing } = motion.timing[mode];
  const ratio = displacement / window.innerWidth;

  const play = (el: HTMLElement | null, slots: readonly SwipeSlotMotion[]) =>
    slots
      .map((slot) =>
        safeAnimate(el, [slot.at(ratio, displacement), slot[mode]], {
          duration,
          easing,
          fill: "none",
        }),
      )
      .filter((animation): animation is Animation => animation !== null);

  return {
    duration,
    animations: [
      ...play(elements.layer, motion.layer),
      ...play(elements.dim, motion.dim),
      ...play(elements.behindLayer, motion.behindLayer),
    ],
  };
}

/**
 * The horizontal translation of a computed `transform`. Null for `none` and
 * for anything the engine reports in a shape this doesn't recognise.
 */
function readTranslateX(value: string): number | null {
  const match = /^matrix(3d)?\(([^)]+)\)$/.exec(value);
  if (!match) return null;

  const parts = match[2].split(",").map((part) => Number.parseFloat(part));
  const translateX = match[1] === "3d" ? parts[12] : parts[4];
  return Number.isFinite(translateX) ? translateX : null;
}

/**
 * How far along a gesture the screen currently looks, in the px displacement
 * the gesture itself speaks — the inverse of `at` above.
 *
 * Used to rebase a re-grab, where the value being read is the output of the
 * release animation, so it must run before that animation is cancelled.
 * Returns null when the environment reports nothing usable (e.g. happy-dom,
 * which resolves no layout).
 */
export function readSwipeDisplacement(
  style: NextAppScreenTransitionStyle,
  elements: Pick<ScreenElements, "layer">,
): number | null {
  if (typeof window === "undefined") return null;

  const { layer } = elements;

  if (style === "horizontalSlide") {
    return layer ? readTranslateX(window.getComputedStyle(layer).transform) : null;
  }

  // Every other style fades the layer out, so opacity is what carries progress.
  if (!layer) return null;

  const opacity = Number.parseFloat(window.getComputedStyle(layer).opacity);
  return Number.isFinite(opacity) ? (1 - opacity) * window.innerWidth : null;
}

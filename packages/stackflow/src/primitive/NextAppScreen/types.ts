export type NextAppScreenTransitionStyle =
  | "horizontalSlide"
  | "verticalSlide"
  | "crossfade"
  /**
   * Two-legged variant of horizontalSlide: the leaving screen shrinks in place
   * first and only then travels off to the right. `experimental_` because the
   * shape of the motion is still being tried out — it can change or be dropped
   * without a major bump.
   */
  | "experimental_scaleSlide";

/**
 * Per-screen transition state, derived in React from the activity's own
 * `transitionState` plus whether it is top. All enter/exit motion is CSS
 * keyed off this attribute — React only flips attributes.
 *
 * The screen's own exit always wins over the positional (top/behind)
 * branches: a screen popped while the screen above is still exiting runs
 * `pop` in parallel, matching its own unmount timer.
 */
export type NextScreenState =
  | "push"
  | "pop"
  | "idle"
  | "push-behind"
  | "pop-behind"
  | "idle-behind";

export type NextSwipeBackArea = "edge" | "full" | "none";

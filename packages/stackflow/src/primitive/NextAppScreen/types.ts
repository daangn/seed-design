export type NextAppScreenTransitionStyle = "horizontalSlide" | "verticalSlide" | "fadeIn";

/**
 * Per-screen transition state, derived in React from the activity's own
 * `transitionState` plus whether it is top. All enter/exit motion is CSS
 * keyed off this attribute — React only flips attributes.
 */
export type NextScreenState =
  | "push"
  | "pop"
  | "idle"
  | "push-behind"
  | "pop-behind"
  | "idle-behind";

export type NextSwipeBackArea = "edge" | "full" | "none";

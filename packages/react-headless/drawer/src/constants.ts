/**
 * TODO: move to recipe
 */
export const TRANSITIONS = {
  ENTER_DURATION: 0.3, // $duration.d6
  EXIT_DURATION: 0.2, // $duration.d4
  OVERLAY_ENTER_TIMING_FUNCTION: "cubic-bezier(0, 0, 0.15, 1)", // $timing-function.enter
  OVERLAY_EXIT_TIMING_FUNCTION: "cubic-bezier(0.35, 0, 1, 1)", // $timing-function.exit
  CONTENT_ENTER_TIMING_FUNCTION: "cubic-bezier(0.03, 0.4, 0.1, 1)", // $timing-function.enter-expressive
  CONTENT_EXIT_TIMING_FUNCTION: "cubic-bezier(0.35, 0, 1, 1)", // $timing-function.exit
};

/**
 * Transition that carries the drawer between keyboard-open and keyboard-closed positions. The value
 * itself belongs to the stylesheet layer (the bottom sheet recipe defines the custom property), but
 * every inline `transition` write on the content element has to append this — inline styles win
 * over the recipe, so dragging or snapping the drawer once would otherwise drop the transition and
 * send the reposition back to jumping in a single frame.
 *
 * The fallback keeps the declaration valid for consumers that don't define the property.
 */
export const KEYBOARD_TRANSITION = "var(--drawer-keyboard-transition, bottom 0s)";

export const VELOCITY_THRESHOLD = 0.4;

export const CLOSE_THRESHOLD = 0.25;

export const SCROLL_LOCK_TIMEOUT = 100;

export const WINDOW_TOP_OFFSET = 26;

export const DRAG_CLASS = "seed-dragging";

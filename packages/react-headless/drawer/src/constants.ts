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
 * Transition that carries the drawer between keyboard-open and keyboard-closed positions.
 * Consumers can override the default through the custom property, but every inline `transition`
 * write on the content element has to append this — inline styles win over stylesheet rules, so
 * dragging or snapping the drawer once would otherwise drop the transition. The keyboard
 * reposition logic also reads this value to configure its synchronized WAAPI timing.
 *
 * The fallback keeps the declaration valid for consumers that don't define the property.
 */
export const DEFAULT_KEYBOARD_TRANSITION = `bottom ${TRANSITIONS.ENTER_DURATION}s ${TRANSITIONS.CONTENT_ENTER_TIMING_FUNCTION}`;
export const KEYBOARD_TRANSITION = `var(--drawer-keyboard-transition, ${DEFAULT_KEYBOARD_TRANSITION})`;
export const VELOCITY_THRESHOLD = 0.4;

export const CLOSE_THRESHOLD = 0.25;

export const SCROLL_LOCK_TIMEOUT = 100;

export const WINDOW_TOP_OFFSET = 26;

export const DRAG_CLASS = "seed-dragging";

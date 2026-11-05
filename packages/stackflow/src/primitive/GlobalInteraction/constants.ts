/**
 * Shared numeric constants for WAAPI animations and inline style math.
 *
 * Consumers:
 * - animation.ts (WAAPI keyframes)
 * - dom.ts (swipe-time inline styles)
 *
 * Keeping these in one place prevents drift between the two consumers.
 */

/** Behind activity's baseline X offset during iOS slide (percent). */
export const BEHIND_OFFSET_PERCENT = -30;

/** Behind activity's parallax multiplier applied to swipe displacement. */
export const BEHIND_PARALLAX = 0.3;

/** Title translate-X multiplier applied to swipe displacement (px). */
export const TITLE_TRANSLATE_RATIO = 0.15;

/** Top title/icon opacity fade rate during swipe (ratio multiplier). */
export const OPACITY_FADE_MULTIPLIER = 3;

/** Title X offset at onscreen/offscreen endpoints (percent). */
export const TITLE_OFFSET_PERCENT = 25;

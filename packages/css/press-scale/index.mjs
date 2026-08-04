// The press scale's public surface for styles this package does not author:
// the class that opts an element in, and the two values its rules consume.
//
// Unlike `@seed-design/css/vars/component/*`, these names are stable API — a
// consumer's own CSS is expected to reference them.
export { PRESS_SCALE_CLASS_NAME } from "../class-names/index.mjs";

/**
 * The pressed scale ratio, with the resting fallback already applied.
 *
 * `--seed-press-scale` is deliberately not registered with `@property`, so
 * until the element is measured — no JS, SSR, the frame before the first
 * ResizeObserver callback — it holds the guaranteed-invalid value. Consuming it
 * without the fallback makes `scale` compute to `none`, dropping the stacking
 * context the resting `scale: 1` exists to hold. The fallback is baked in here
 * so it cannot be left out.
 */
export const pressScale = "var(--seed-press-scale, 1)";

/**
 * The `transition` list entry that animates the scale, carrying the
 * `$duration.pressed-scale` and `$timing-function.pressed-scale` tokens.
 *
 * `transition` is a shorthand, so a rule that animates anything else replaces
 * it whole — splice this into your own list rather than choosing between it and
 * your own transitions.
 */
export const pressScaleTransition = "var(--seed-press-scale-transition)";

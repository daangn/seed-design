// The press scale's public surface for styles this package does not author:
// the class that opts an element in, and the two values its rules consume.
//
// Unlike `@seed-design/css/vars/component/*`, these names are stable API — a
// consumer's own CSS is expected to reference them.
/**
 * Duplicated in packages/qvism-preset/src/utils/press-scale.ts, which emits the
 * matching rule and cannot import from here (css is generated from it). Edit
 * both together — nothing checks, and drift silently leaves the derivation
 * unapplied.
 */
export const PRESS_SCALE_CLASS_NAME = "seed-press-scale";

/**
 * The pressed scale ratio.
 *
 * base.css declares it on `:root` and again on every element carrying
 * `PRESS_SCALE_CLASS_NAME`, so it is defined everywhere in the document and
 * resolves to 1 wherever no measurement exists yet — before the first
 * ResizeObserver callback, under SSR, or with no JS at all. Reading it needs no
 * fallback of its own.
 */
export const pressScale = "var(--seed-press-scale)";

/**
 * The `transition` list entry that animates the scale, carrying the
 * `$duration.pressed-scale` and `$timing-function.pressed-scale` tokens.
 *
 * `transition` is a shorthand, so a rule that animates anything else replaces
 * it whole — splice this into your own list rather than choosing between it and
 * your own transitions.
 */
export const pressScaleTransition = "var(--seed-press-scale-transition)";

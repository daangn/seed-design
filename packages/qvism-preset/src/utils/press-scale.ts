import type { StyleObject } from "@seed-design/qvism-core";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

/**
 * Runtime press scale.
 *
 * `--seed-element-width` / `--seed-element-height` are the element's rendered
 * size, published by `useElementSizeVars` in `@seed-design/react`. That side
 * knows nothing about pressing — it only reports size, and everything specific
 * to this mechanism is derived here:
 *
 *   basis = max(height, width / WIDTH_DIVISOR, MIN_BASIS)
 *   scale = (basis - PRESS_DEPTH) / basis
 *
 * `basis` is the length PRESS_DEPTH is measured against — whichever term wins
 * shrinks by exactly PRESS_DEPTH px, so height-driven elements always lose 2px
 * of height and width-driven ones always lose 8px of width.
 *
 * This is a first-order variant of react-spectrum S2's `p / (p + depth)`, where
 * `p` is a literal `perspective()` distance. We compute a plain scale with no 3D
 * transform involved, so the value is a length to compare against rather than a
 * viewing distance — hence `basis`, not `perspective`.
 *
 * The three parameters are plain constants rather than tokens on purpose. They
 * describe the shape of the curve for every pressable in the system and in
 * consumer projects alike, so there is nothing per-theme or per-component to
 * resolve. As tokens they would have surfaced as `:root` custom properties that
 * any element or ancestor could redeclare, including in ways that defeat the
 * reduced-motion rule below.
 *
 * Without JS the size vars are unset, which makes the whole derivation chain
 * guaranteed-invalid; every consumer reads `var(--seed-press-scale, 1)` and
 * falls back to 1 — no scale, no breakage.
 *
 * The gate belongs to the consumer: `createPressScaleRestStyles` pins the
 * resting value, and `createPressScaleStyles` is dropped into whatever selector
 * the recipe owns — usually `pseudo(not(disabled), active)`, but
 * attachment-input gates on `[aria-grabbed=true]` to shrink a dragged item by
 * the same depth. Neither emits the derivation: that lives once in base.css,
 * and the element opts in by carrying `PRESS_SCALE_CLASS_NAME`.
 *
 * Some components want the background to stay put while only the content
 * shrinks. That needs two boxes at different scales, but the fixed one is always
 * pure paint (background, stroke, divider), so it can be a pseudo-element rather
 * than a wrapper in the DOM: scale the element itself and cancel it on the
 * pseudo with `createPressScaleCounter*Styles`. The size vars are unitless, so
 * the inverse is an exact `number / number` and the two scales multiply back to
 * 1 with no rounding drift.
 *
 * One constraint comes with that: the scaling element and its ancestors must not
 * clip at the counter-scaled layer's edges. `overflow` clips in the clipping
 * element's *untransformed* coordinate space, so a layer scaled back up by
 * 1/scale is a couple of percent larger than the clip box and loses its outer
 * edge — which is exactly where an `inset` stroke sits, so the stroke disappears
 * for as long as the press lasts while the background looks unaffected. If a
 * component genuinely needs the clip, it cannot use the counter-scale and should
 * scale as a whole instead.
 */
const WIDTH_DIVISOR = 4;
const MIN_BASIS = 24;
const PRESS_DEPTH = 2;

/**
 * Marks an element as deriving a press scale from its own rendered size.
 * `@seed-design/react` puts it on every element it measures (`usePressScale`),
 * and a consumer building a custom pressable puts it on theirs.
 */
export const PRESS_SCALE_CLASS_NAME = "seed-press-scale";

/**
 * The derivation itself, defined once for the whole system. Spread into
 * `globalCss` so it ships in base.css instead of being repeated in every recipe
 * that scales on press — the declarations land on the same element either way,
 * so the computed result is identical.
 */
export const pressScaleGlobalStyles = {
  [`.${PRESS_SCALE_CLASS_NAME}`]: {
    "--seed-press-scale-basis": `max(var(--seed-element-height), var(--seed-element-width) / ${WIDTH_DIVISOR}, ${MIN_BASIS})`,
    "--seed-press-scale": `calc((var(--seed-press-scale-basis) - ${PRESS_DEPTH}) / var(--seed-press-scale-basis))`,
    "--seed-press-scale-inverse": `calc(var(--seed-press-scale-basis) / (var(--seed-press-scale-basis) - ${PRESS_DEPTH}))`,

    // Pin the outputs rather than zeroing a depth parameter: these are declared
    // on the same element as the derivation and after it, so no value a consumer
    // can set upstream brings the scale back.
    "@media (prefers-reduced-motion: reduce)": {
      "--seed-press-scale": "1",
      "--seed-press-scale-inverse": "1",
    },
  },
} satisfies Record<string, StyleObject>;

export const PRESS_SCALE_TRANSITION = `scale ${duration.pressedScale} ${timingFunction.pressedScale}`;

/**
 * Resting styles for the paint-only layer that must stay put while its element
 * scales — a `::before` carrying the background, or an absolutely positioned
 * overlay element such as input-button's `button` slot. Pair with
 * `createPressScaleCounterStyles` in the same selector the element uses.
 */
export const createPressScaleCounterRestStyles = (): StyleObject => ({ scale: "1" });

/**
 * Pressed styles for that layer: exactly cancels the element's own press scale,
 * so the background renders at its original size and position while everything
 * else inside the element shrinks. Both scales share a transform-origin of
 * center and are uniform, so the composition is an exact identity.
 */
export const createPressScaleCounterStyles = (): StyleObject => ({
  scale: "var(--seed-press-scale-inverse, 1)",
});

/**
 * Resting styles for a slot that scales while pressed. Pair with
 * `createPressScaleStyles` in the pressed selector.
 *
 * The identity value is load-bearing rather than a transition seed — `scale`
 * interpolates from `none` on its own. A non-`none` `scale` makes the element a
 * stacking context and a containing block for `position: fixed` descendants, and
 * the pressed value is always a number (reduced motion and the no-JS fallback
 * both resolve to 1). Declaring it at rest too keeps that constant instead of
 * toggling it on every press, which would move fixed descendants mid-gesture.
 *
 * Individual `scale` over `transform: scale()` — progressive enhancement for
 * Chrome 104+ (older browsers just skip the pressed scale).
 */
export const createPressScaleRestStyles = (): StyleObject => ({ scale: "1" });

/**
 * Pressed styles for a slot that scales while pressed. Drop this into the gate
 * the recipe owns (e.g. `pseudo(not(disabled), active)`). Pass `overridableBy`
 * to route the consumed value through an inherited custom property so an ancestor
 * can opt the slot out — mark recipes use this so a wrapper can set e.g.
 * `--seed-checkmark-press-scale: 1` to keep a nested mark from scaling.
 */
export const createPressScaleStyles = ({
  overridableBy,
}: { overridableBy?: `--${string}` } | undefined = {}): StyleObject => ({
  scale: overridableBy
    ? `var(${overridableBy}, var(--seed-press-scale, 1))`
    : "var(--seed-press-scale, 1)",
});

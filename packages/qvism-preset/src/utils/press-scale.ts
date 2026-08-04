import type { StyleObject } from "@seed-design/qvism-core";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

/**
 * Runtime press scale.
 *
 * `--seed-element-width` / `--seed-element-height` are the element's rendered
 * size, published by `useElementSizeVars` in `@seed-design/react`. That side
 * knows nothing about pressing — it only reports size, and everything specific
 * to this mechanism is derived here.
 *
 * `basis` is the length `PRESS_DEPTH` is measured against — whichever term of
 * the `max()` wins shrinks by exactly that many px, so height-driven elements
 * always lose 2px of height and width-driven ones always lose 8px of width.
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
 * The gate belongs to the consumer: `createPressScaleStyles` is dropped into
 * whatever selector the recipe owns — usually `pseudo(not(disabled), active)`,
 * but attachment-input gates on `[aria-grabbed=true]` to shrink a dragged item
 * by the same depth. It emits neither the derivation nor the resting value:
 * both live once in base.css, and the element opts in by carrying
 * `PRESS_SCALE_CLASS_NAME`.
 *
 * Deliberately absent: a way to keep a slot's background fixed while only its
 * content shrinks (`scaleScope: content` in the component specs). That needs two
 * boxes at different scales, and every component declaring it is held for the
 * next major — so the specs carry the declaration while nothing here implements
 * it yet.
 */
const WIDTH_DIVISOR = 4;
const MIN_BASIS = 24;
const PRESS_DEPTH = 2;

/**
 * Marks an element as deriving a press scale from its own rendered size, and
 * pins its resting `scale`. `@seed-design/react` puts it on every element it
 * measures (`usePressScale`), and a consumer building a custom pressable puts it
 * on theirs.
 */
export const PRESS_SCALE_CLASS_NAME = "seed-press-scale";

/**
 * Hoisted into base.css rather than repeated by every recipe that scales on
 * press — the declarations land on the same element either way, so the computed
 * result is identical.
 *
 * Not registered with `@property` (`<number>`, `inherits: false`,
 * `initial-value: 1`), which would retire the `var(…, 1)` fallbacks and keep the
 * ratio from inheriting into descendants. Both Safari and Firefox shipped
 * `@property` well after individual `scale` (16.4 vs 14.1, 128 vs 72), and on
 * those versions a fallback-less `scale` computes to `none` mid-press, dropping
 * the stacking context the resting `scale` below exists to hold.
 */
export const pressScaleGlobalStyles = {
  [`.${PRESS_SCALE_CLASS_NAME}`]: {
    "--seed-press-scale-basis": `max(var(--seed-element-height), var(--seed-element-width) / ${WIDTH_DIVISOR}, ${MIN_BASIS})`,
    "--seed-press-scale": `calc((var(--seed-press-scale-basis) - ${PRESS_DEPTH}) / var(--seed-press-scale-basis))`,

    // Not a transition seed — `scale` interpolates from `none` on its own. A
    // non-`none` `scale` makes the element a stacking context and a containing
    // block for `position: fixed` descendants, so pinning the identity value on
    // the class keeps that constant instead of switching it on at every press,
    // which would move fixed descendants mid-gesture.
    //
    // Individual `scale` over `transform: scale()` — progressive enhancement for
    // Chrome 104+ (older browsers just skip the pressed scale).
    scale: "1",

    // Pin the output rather than zeroing a depth parameter: this is declared on
    // the same element as the derivation and after it, so no value a consumer
    // can set upstream brings the scale back.
    "@media (prefers-reduced-motion: reduce)": {
      "--seed-press-scale": "1",
    },
  },
} satisfies Record<string, StyleObject>;

export const PRESS_SCALE_TRANSITION = `scale ${duration.pressedScale} ${timingFunction.pressedScale}`;

/**
 * `transition` is a shorthand, so a rule that animates anything else replaces it
 * whole — CSS gives no way to append to one. Published as a custom property so
 * that styles this package does not author can splice the scale into their own
 * transition list rather than choosing between it and their own:
 *
 *   transition: background-color 0.2s, var(--seed-press-scale-transition);
 *
 * Recipes here interpolate `PRESS_SCALE_TRANSITION` directly instead, since they
 * assemble the whole list themselves.
 */
export const pressScaleRootVars = {
  "--seed-press-scale-transition": PRESS_SCALE_TRANSITION,
} satisfies StyleObject;

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

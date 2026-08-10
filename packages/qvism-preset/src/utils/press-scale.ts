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
 * Two custom properties carry the result. `--seed-press-scale-measured` is the
 * derivation, and is guaranteed-invalid whenever the size vars are unset — no
 * JS, SSR, the frame before the first ResizeObserver callback, or one half of
 * the ref/class pair missing. `--seed-press-scale` is the name everything reads,
 * and absorbs that invalidity into 1 where it is declared, so no rule that
 * consumes it carries a fallback of its own.
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

// Duplicated from packages/css/press-scale/index.mjs
// since qvism-preset cannot depend on @seed-design/css (css is generated from qvism-preset)
// edit both together — nothing checks, and drift silently leaves the derivation unapplied

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
 * Registering `--seed-press-scale` with `@property` (`<number>`,
 * `initial-value: 1`) would make the same guarantee the fallback below makes,
 * without needing the second name. SEED supports Safari 15, which shipped
 * individual `scale` in 14.1 but `@property` only in 16.4, so a registration
 * would hold on newer engines alone — and a guarantee that holds only where it
 * is easy to test is worse than none, since the `scale: none` it prevents would
 * then reproduce on the old browsers exclusively.
 */
export const pressScaleGlobalStyles = {
  [`.${PRESS_SCALE_CLASS_NAME}`]: {
    "--seed-press-scale-basis": `max(var(--seed-element-height), var(--seed-element-width) / ${WIDTH_DIVISOR}, ${MIN_BASIS})`,
    "--seed-press-scale-measured": `calc((var(--seed-press-scale-basis) - ${PRESS_DEPTH}) / var(--seed-press-scale-basis))`,
    "--seed-press-scale": "var(--seed-press-scale-measured, 1)",

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
 * Document-wide defaults for the two names styles this package does not author
 * are expected to reference.
 *
 * `--seed-press-scale` resolves to 1 outside any pressable, which is what lets
 * every rule read it bare. It sits on `:root` rather than `*` so that the ratio a
 * pressable declares still inherits into its own descendants — an element that
 * scales a child instead of itself reads the same name.
 *
 * `transition` is a shorthand, so a rule that animates anything else replaces it
 * whole — CSS gives no way to append to one. Publishing the scale's entry
 * separately lets those styles splice it into their own list rather than
 * choosing between it and their own:
 *
 *   transition: background-color 0.2s, var(--seed-press-scale-transition);
 *
 * Recipes here interpolate `PRESS_SCALE_TRANSITION` directly instead, since they
 * assemble the whole list themselves.
 */
export const pressScaleRootVars = {
  "--seed-press-scale": "1",
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
    ? `var(${overridableBy}, var(--seed-press-scale))`
    : "var(--seed-press-scale)",
});

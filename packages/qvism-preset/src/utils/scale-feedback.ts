import type { StyleObject } from "@seed-design/qvism-core";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

/**
 * Scale feedback: an element shrinks slightly while pressed.
 *
 * The ratio is not a fixed number per size variant. It is derived at runtime
 * from the element's own rendered size — the dynamic scale — so elements of
 * different sizes lose the same number of px rather than the same percentage.
 *
 * `--seed-element-width` / `--seed-element-height` are that rendered size,
 * published by `useElementSizeVars` in `@seed-design/react`. That side knows
 * nothing about pressing — it only reports size, and everything specific to
 * this mechanism is derived here.
 *
 * `basis` is the length `SCALE_DEPTH` is measured against — whichever term of
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
 * Two custom properties carry the result. `--seed-dynamic-scale` is the
 * derivation, and is guaranteed-invalid whenever the size vars are unset — no
 * JS, SSR, the frame before the first ResizeObserver callback, or one half of
 * the ref/class pair missing. `--seed-feedback-scale` is the name everything reads,
 * and absorbs that invalidity into 1 where it is declared, so no rule that
 * consumes it carries a fallback of its own.
 *
 * The gate belongs to the consumer: `createScaleFeedbackStyles` is dropped into
 * whatever selector the recipe owns — usually `pseudo(not(disabled), active)`,
 * but attachment-input gates on `[aria-grabbed=true]` to shrink a dragged item
 * by the same depth. It emits neither the derivation nor the resting value:
 * both live once in base.css, and the element opts in by carrying
 * `SCALE_FEEDBACK_CLASS_NAME`.
 *
 * Deliberately absent: a way to keep a slot's background fixed while only its
 * content shrinks (`scaleScope: content` in the component specs). That needs two
 * boxes at different scales, and every component declaring it is held for the
 * next major — so the specs carry the declaration while nothing here implements
 * it yet.
 */
const WIDTH_DIVISOR = 4;
const MIN_BASIS = 24;
const SCALE_DEPTH = 2;

// Duplicated from packages/css/scale-feedback/index.mjs
// since qvism-preset cannot depend on @seed-design/css (css is generated from qvism-preset)
// edit both together — nothing checks, and drift silently leaves the derivation unapplied

/**
 * Marks an element as deriving its feedback scale from its own rendered size,
 * and pins its resting `scale`. `@seed-design/react` puts it on every element
 * it measures (`useScaleFeedback`), and a consumer building a custom pressable
 * puts it on theirs.
 */
export const SCALE_FEEDBACK_CLASS_NAME = "seed-scale-feedback";

/**
 * Hoisted into base.css rather than repeated by every recipe that scales on
 * press — the declarations land on the same element either way, so the computed
 * result is identical.
 *
 * Registering `--seed-feedback-scale` with `@property` (`<number>`,
 * `initial-value: 1`) would make the same guarantee the fallback below makes,
 * without needing the second name. SEED supports Safari 15, which shipped
 * individual `scale` in 14.1 but `@property` only in 16.4, so a registration
 * would hold on newer engines alone — and a guarantee that holds only where it
 * is easy to test is worse than none, since the `scale: none` it prevents would
 * then reproduce on the old browsers exclusively.
 */
export const scaleFeedbackGlobalStyles = {
  [`.${SCALE_FEEDBACK_CLASS_NAME}`]: {
    "--seed-dynamic-scale-basis": `max(var(--seed-element-height), var(--seed-element-width) / ${WIDTH_DIVISOR}, ${MIN_BASIS})`,
    "--seed-dynamic-scale": `calc((var(--seed-dynamic-scale-basis) - ${SCALE_DEPTH}) / var(--seed-dynamic-scale-basis))`,
    "--seed-feedback-scale": "var(--seed-dynamic-scale, 1)",

    // Not a transition seed — `scale` interpolates from `none` on its own. A
    // non-`none` `scale` makes the element a stacking context and a containing
    // block for `position: fixed` descendants, so pinning the identity value on
    // the class keeps that constant instead of switching it on at every press,
    // which would move fixed descendants mid-gesture.
    //
    // Individual `scale` over `transform: scale()` — progressive enhancement for
    // Chrome 104+ (older browsers just skip the scale feedback).
    scale: "1",

    // Pin the output rather than zeroing a depth parameter: this is declared on
    // the same element as the derivation and after it, so no value a consumer
    // can set upstream brings the scale back.
    "@media (prefers-reduced-motion: reduce)": {
      "--seed-feedback-scale": "1",
    },
  },
} satisfies Record<string, StyleObject>;

export const FEEDBACK_SCALE_TRANSITION = `scale ${duration.pressedScale} ${timingFunction.pressedScale}`;

/**
 * Document-wide defaults for the two names styles this package does not author
 * are expected to reference.
 *
 * `--seed-feedback-scale` resolves to 1 outside any pressable, which is what lets
 * every rule read it bare. It sits on `:root` rather than `*` so that the ratio a
 * pressable declares still inherits into its own descendants — an element that
 * scales a child instead of itself reads the same name.
 *
 * `transition` is a shorthand, so a rule that animates anything else replaces it
 * whole — CSS gives no way to append to one. Publishing the scale's entry
 * separately lets those styles splice it into their own list rather than
 * choosing between it and their own:
 *
 *   transition: background-color 0.2s, var(--seed-feedback-scale-transition);
 *
 * Recipes here interpolate `FEEDBACK_SCALE_TRANSITION` directly instead, since they
 * assemble the whole list themselves.
 */
export const scaleFeedbackRootVars = {
  "--seed-feedback-scale": "1",
  "--seed-feedback-scale-transition": FEEDBACK_SCALE_TRANSITION,
} satisfies StyleObject;

/**
 * Pressed styles for a slot that scales while pressed. Drop this into the gate
 * the recipe owns (e.g. `pseudo(not(disabled), active)`). Pass `overridableBy`
 * to route the consumed value through an inherited custom property so an ancestor
 * can opt the slot out — mark recipes use this so a wrapper can set e.g.
 * `--seed-checkmark-feedback-scale: 1` to keep a nested mark from scaling.
 */
export const createScaleFeedbackStyles = ({
  overridableBy,
}: { overridableBy?: `--${string}` } | undefined = {}): StyleObject => ({
  scale: overridableBy
    ? `var(${overridableBy}, var(--seed-feedback-scale))`
    : "var(--seed-feedback-scale)",
});

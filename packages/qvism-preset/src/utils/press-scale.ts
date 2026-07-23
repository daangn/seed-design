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
 * Resting styles for a slot that scales while pressed. Pair with
 * `createPressScaleStyles` in the pressed selector. Pass `as` to publish through
 * a custom property instead of the `scale` property — an inner layout slot can
 * then consume it with `scale: var(<as>, 1)` and no state forwarding in React.
 */
export function createPressScaleRestStyles({
  as = "scale",
}: { as?: "scale" | `--${string}` } | undefined = {}): StyleObject {
  // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
  if (as === "scale") return { scale: "1" };

  const styles: StyleObject = {};
  styles[as] = "1";
  return styles;
}

/**
 * Pressed styles for a slot that scales while pressed. Drop this into the gate
 * the recipe owns (e.g. `pseudo(not(disabled), active)`). Pass `as` to publish
 * through a custom property instead of the `scale` property. Pass `overridableBy`
 * to route the consumed value through an inherited custom property so an ancestor
 * can opt the slot out — mark recipes use this so a wrapper can set e.g.
 * `--seed-checkmark-press-scale: 1` to keep a nested mark from scaling.
 */
export function createPressScaleStyles({
  as = "scale",
  overridableBy,
}: { as?: "scale" | `--${string}`; overridableBy?: `--${string}` } | undefined = {}): StyleObject {
  const value = overridableBy
    ? (`var(${overridableBy}, var(--seed-press-scale, 1))` as const)
    : "var(--seed-press-scale, 1)";

  if (as === "scale") return { scale: value };

  const styles: StyleObject = {};
  styles[as] = value;
  return styles;
}

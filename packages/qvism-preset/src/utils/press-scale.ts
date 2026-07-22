import type { StyleObject } from "@seed-design/qvism-core";
import * as duration from "../vars/duration";
import * as pressScale from "../vars/press-scale";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";

/**
 * Runtime press scale.
 *
 * `--seed-element-width` / `--seed-element-height` are the element's rendered
 * size, published by `useElementSizeVars` in `@seed-design/react`. That side
 * knows nothing about pressing — it only reports size, and everything specific
 * to this mechanism is derived here so the policy stays token-driven:
 *
 *   p = max(height, width / $press-scale.width-divisor, $press-scale.min-perspective)
 *   scale = (p - $scale.press-depth) / p
 *
 * The pressed size lands exactly press-depth px smaller along the dimension
 * that decided p (first-order variant of react-spectrum S2's p / (p + depth)).
 * Under prefers-reduced-motion, $scale.press-depth resolves to 0, so the
 * computed scale resolves to 1 with no per-recipe media query.
 *
 * Without JS the size vars are unset, which makes the whole derivation chain
 * guaranteed-invalid; every consumer reads `var(--seed-press-scale, 1)` and
 * falls back to 1 — no scale, no breakage.
 *
 * The gate belongs to the consumer: `createPressScaleRestStyles` seeds the
 * derivation plus the resting value, and `createPressScaleStyles` is dropped
 * into whatever selector the recipe owns — usually `pseudo(not(disabled),
 * active)`, but attachment-input gates on `[aria-grabbed=true]` to shrink a
 * dragged item by the same depth.
 */
const derivationStyles = {
  "--seed-press-scale-perspective": `max(var(--seed-element-height), var(--seed-element-width) / ${pressScale.widthDivisor}, ${pressScale.minPerspective})`,
  "--seed-press-scale": `calc((var(--seed-press-scale-perspective) - ${scale.pressDepth}) / var(--seed-press-scale-perspective))`,
};

export const PRESS_SCALE_TRANSITION = `scale ${duration.pressedScale} ${timingFunction.pressedScale}`;

/**
 * Resting styles for a slot that scales while pressed: seeds the derivation
 * chain and pins the rest value. Pair with `createPressScaleStyles` in the
 * pressed selector. Pass `as` to publish through a custom property instead of
 * the `scale` property — an inner layout slot can then consume it with
 * `scale: var(<as>, 1)` and no state forwarding in React.
 */
export function createPressScaleRestStyles({
  as = "scale",
}: { as?: "scale" | `--${string}` } | undefined = {}): StyleObject {
  if (as === "scale") {
    return {
      ...derivationStyles,

      // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
      scale: "1",
    };
  }

  const styles: StyleObject = { ...derivationStyles };
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

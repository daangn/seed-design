import type { StyleObject } from "@seed-design/qvism-core";
import * as pressScale from "../vars/press-scale";
import * as scale from "../vars/scale";
import { active, disabled, not, pseudo } from "./pseudo";

/**
 * Runtime press scale.
 *
 * `--seed-press-width` / `--seed-press-height` are unitless layout sizes kept
 * in sync by `usePressScale` in `@seed-design/react`. Everything else is
 * derived here so the policy stays token-driven:
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
 * guaranteed-invalid; every consumer reads `var(--seed-pressed-scale, 1)` and
 * falls back to 1 — no scale, no breakage.
 */
const derivationStyles = {
  "--seed-press-perspective": `max(var(--seed-press-height), var(--seed-press-width) / ${pressScale.widthDivisor}, ${pressScale.minPerspective})`,
  "--seed-pressed-scale": `calc((var(--seed-press-perspective) - ${scale.pressDepth}) / var(--seed-press-perspective))`,
};

const DEFAULT_GATE = pseudo(not(disabled), active);

/**
 * Inherited override consumed by mark recipes (checkmark/radiomark/switchmark).
 * Wrappers set it to `1` to opt nested marks out of the pressed scale — the
 * size vars are element-scoped inline styles, so opting out from an ancestor
 * is only possible through this indirection.
 */
export const MARK_PRESSED_SCALE_VAR = "--seed-mark-pressed-scale";

/**
 * Scales the slot itself while pressed. `overridableBy` routes the consumed
 * value through an inherited custom property so ancestors can opt the slot
 * out (see MARK_PRESSED_SCALE_VAR).
 */
export function createPressScaleStyles({
  gate = DEFAULT_GATE,
  overridableBy,
}: { gate?: string; overridableBy?: string } | undefined = {}): StyleObject {
  return {
    ...derivationStyles,

    // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
    scale: "1",

    [gate]: {
      scale: overridableBy
        ? `var(${overridableBy}, var(--seed-pressed-scale, 1))`
        : "var(--seed-pressed-scale, 1)",
    },
  };
}

/**
 * Content-scale source: the gated element (the pressed surface) publishes the
 * computed value through `scaleVar` — custom properties inherit, so an inner
 * layout slot can consume it with `scale: var(scaleVar, 1)` and no state
 * forwarding in React.
 */
export function createPressScaleVarStyles(
  scaleVar: string,
  { gate = DEFAULT_GATE }: { gate?: string } | undefined = {},
): StyleObject {
  return {
    ...derivationStyles,

    [gate]: {
      [scaleVar]: "var(--seed-pressed-scale, 1)",
    },
  };
}

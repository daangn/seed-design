import type { StyleObject } from "@seed-design/qvism-core";
import { vars } from "../vars";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

export const FOCUS_RING_TRANSITION = `outline-color ${duration.d2} ${timingFunction.easing}`;

export function createFocusRingRestStyles({
  position = "outside",
  overridableBy,
}: { position?: "outside" | "inside"; overridableBy?: string } | undefined = {}): StyleObject {
  const outlineOffset =
    position === "outside" ? vars.$dimension.x0_5 : `calc(${vars.$dimension.x0_5} * -1)`;

  if (overridableBy) {
    return {
      outline: `var(${overridableBy}, ${vars.$dimension.x0_5} solid transparent)`,
      outlineOffset,
    };
  }

  return {
    outline: `${vars.$dimension.x0_5} solid transparent`,
    outlineOffset,
  };
}

export function createFocusRingStyles({
  position = "outside",
  overridableBy,
}: { position?: "outside" | "inside"; overridableBy?: string } | undefined = {}): StyleObject {
  const outlineOffset =
    position === "outside" ? vars.$dimension.x0_5 : `calc(${vars.$dimension.x0_5} * -1)`;

  if (overridableBy) {
    return {
      outline: `var(${overridableBy}, ${vars.$dimension.x0_5} solid ${vars.$color.stroke.focusRing})`,
      outlineOffset,
    };
  }

  return {
    outline: `${vars.$dimension.x0_5} solid ${vars.$color.stroke.focusRing}`,
    outlineOffset,
  };
}

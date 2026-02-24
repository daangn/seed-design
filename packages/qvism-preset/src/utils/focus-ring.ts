import type { StyleObject } from "@seed-design/qvism-core";
import { vars } from "../vars";

export const focusRingStyles: StyleObject = {
  outlineWidth: vars.$dimension.x0_5,
  outlineStyle: "solid",
  outlineColor: vars.$color.stroke.focusRing,
  outlineOffset: vars.$dimension.x0_5,
};

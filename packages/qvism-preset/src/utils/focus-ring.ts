import type { StyleObject } from "@seed-design/qvism-core";
import { vars } from "../vars";

export function createFocusRingStyles({
  position = "outside",
}: { position?: "outside" | "inside" } | undefined = {}): StyleObject {
  switch (position) {
    case "outside":
      return {
        outlineWidth: vars.$dimension.x0_5,
        outlineStyle: "solid",
        outlineColor: vars.$color.stroke.focusRing,
        outlineOffset: vars.$dimension.x0_5,
      };

    case "inside":
      return {
        outlineWidth: vars.$dimension.x0_5,
        outlineStyle: "solid",
        outlineColor: vars.$color.stroke.focusRing,
        outlineOffset: `calc(${vars.$dimension.x0_5} * -1)`,
      };
  }
}

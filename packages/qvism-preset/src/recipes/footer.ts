import * as fg from "../vars/color/fg";
import * as dimension from "../vars/dimension";
import * as duration from "../vars/duration";
import * as fontSize from "../vars/font-size";
import * as fontWeight from "../vars/font-weight";
import * as lineHeight from "../vars/line-height";
import * as timingFunction from "../vars/timing-function";
import { suffixIcon } from "../utils/icon";
import { defineSlotRecipe } from "../utils/define";
import { engaged, pseudo } from "../utils/pseudo";

const footer = defineSlotRecipe({
  name: "footer",
  slots: ["linkText"],
  base: {
    linkText: {
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
      gap: dimension.x1,
      transition: `color ${duration.colorTransition} ${timingFunction.easing}`,
    },
  },
  variants: {
    size: {
      large: {
        linkText: {
          fontSize: fontSize.t5,
          lineHeight: lineHeight.t5,
          fontWeight: fontWeight.medium,
          color: fg.neutral,

          ...suffixIcon({
            color: fg.neutral,
            size: "14px",
          }),

          [pseudo(engaged)]: {
            color: fg.neutralSubtle,
          },
        },
      },
      medium: {
        linkText: {
          fontSize: fontSize.t4,
          lineHeight: lineHeight.t4,
          fontWeight: fontWeight.medium,
          color: fg.neutralMuted,

          ...suffixIcon({
            color: fg.neutralMuted,
            size: "12px",
          }),

          [pseudo(engaged)]: {
            color: fg.neutral,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default footer;

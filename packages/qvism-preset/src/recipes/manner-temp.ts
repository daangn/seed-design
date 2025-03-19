import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";
import { mannerTemp as vars } from "../vars/component";

const mannerTemp = defineRecipe({
  name: "manner-temp",
  base: {
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",

    gap: vars.base.enabled.root.gap,

    fontSize: vars.base.enabled.label.fontSize,
    lineHeight: vars.base.enabled.label.lineHeight,
    fontWeight: vars.base.enabled.label.fontWeight,

    ...suffixIcon({
      size: vars.base.enabled.emote.size,
    }),
  },
  variants: {
    level: {
      l1: {
        color: vars.levelL1.enabled.label.color,
      },
      l2: {
        color: vars.levelL2.enabled.label.color,
      },
      l3: {
        color: vars.levelL3.enabled.label.color,
      },
      l4: {
        color: vars.levelL4.enabled.label.color,
      },
      l5: {
        color: vars.levelL5.enabled.label.color,
      },
      l6: {
        color: vars.levelL6.enabled.label.color,
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTemp;

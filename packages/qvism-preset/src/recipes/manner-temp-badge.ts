import { mannerTempBadge as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const mannerTempBadge = defineRecipe({
  name: "manner-temp-badge",
  base: {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",

    textTransform: "none",
    textAlign: "start",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",

    borderRadius: vars.base.enabled.root.cornerRadius,
    minHeight: vars.base.enabled.root.minHeight,
    paddingInline: vars.base.enabled.root.paddingX,
    paddingBlock: vars.base.enabled.root.paddingY,

    fontSize: vars.base.enabled.label.fontSize,
    lineHeight: vars.base.enabled.label.lineHeight,
    fontWeight: vars.base.enabled.label.fontWeight,
  },
  variants: {
    level: {
      l1: {
        backgroundColor: vars.levelL1.enabled.root.color,
        color: vars.levelL1.enabled.label.color,
      },
      l2: {
        backgroundColor: vars.levelL2.enabled.root.color,
        color: vars.levelL2.enabled.label.color,
      },
      l3: {
        backgroundColor: vars.levelL3.enabled.root.color,
        color: vars.levelL3.enabled.label.color,
      },
      l4: {
        backgroundColor: vars.levelL4.enabled.root.color,
        color: vars.levelL4.enabled.label.color,
      },
      l5: {
        backgroundColor: vars.levelL5.enabled.root.color,
        color: vars.levelL5.enabled.label.color,
      },
      l6: {
        backgroundColor: vars.levelL6.enabled.root.color,
        color: vars.levelL6.enabled.label.color,
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTempBadge;

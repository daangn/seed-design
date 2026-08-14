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

    borderRadius: vars.base.rest.root.cornerRadius,
    minHeight: vars.base.rest.root.minHeight,
    paddingInline: vars.base.rest.root.paddingX,
    paddingBlock: vars.base.rest.root.paddingY,

    fontSize: vars.base.rest.label.fontSize,
    lineHeight: vars.base.rest.label.lineHeight,
    fontWeight: vars.base.rest.label.fontWeight,
  },
  variants: {
    level: {
      l1: {
        backgroundColor: vars.levelL1.rest.root.color,
        color: vars.levelL1.rest.label.color,
      },
      l2: {
        backgroundColor: vars.levelL2.rest.root.color,
        color: vars.levelL2.rest.label.color,
      },
      l3: {
        backgroundColor: vars.levelL3.rest.root.color,
        color: vars.levelL3.rest.label.color,
      },
      l4: {
        backgroundColor: vars.levelL4.rest.root.color,
        color: vars.levelL4.rest.label.color,
      },
      l5: {
        backgroundColor: vars.levelL5.rest.root.color,
        color: vars.levelL5.rest.label.color,
      },
      l6: {
        backgroundColor: vars.levelL6.rest.root.color,
        color: vars.levelL6.rest.label.color,
      },
      l7: {
        backgroundColor: vars.levelL7.rest.root.color,
        color: vars.levelL7.rest.label.color,
      },
      l8: {
        backgroundColor: vars.levelL8.rest.root.color,
        color: vars.levelL8.rest.label.color,
      },
      l9: {
        backgroundColor: vars.levelL9.rest.root.color,
        color: vars.levelL9.rest.label.color,
      },
      l10: {
        backgroundColor: vars.levelL10.rest.root.color,
        color: vars.levelL10.rest.label.color,
      },
    },
  },
  defaultVariants: {
    level: "l1",
  },
});

export default mannerTempBadge;

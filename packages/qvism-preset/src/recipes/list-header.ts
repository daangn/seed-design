import { defineRecipe } from "../utils/define";
import { listHeader as vars } from "../vars/component";

const listHeader = defineRecipe({
  name: "list-header",
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: vars.base.enabled.root.gap,
    justifyContent: "space-between",

    boxSizing: "border-box",

    paddingLeft: vars.base.enabled.root.paddingX,
    paddingRight: vars.base.enabled.root.paddingX,
    paddingTop: vars.base.enabled.root.paddingY,
    paddingBottom: vars.base.enabled.root.paddingY,

    fontSize: vars.base.enabled.root.fontSize,
    lineHeight: vars.base.enabled.root.lineHeight,
  },
  variants: {
    variant: {
      mediumWeak: {
        fontWeight: vars.variantMediumWeak.enabled.root.fontWeight,
        color: vars.variantMediumWeak.enabled.root.color,
      },
      boldSolid: {
        fontWeight: vars.variantBoldSolid.enabled.root.fontWeight,
        color: vars.variantBoldSolid.enabled.root.color,
      },
    },
  },
  defaultVariants: {
    variant: "mediumWeak",
  },
});

export default listHeader;

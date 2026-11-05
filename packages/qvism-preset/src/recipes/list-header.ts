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

    paddingInline: vars.base.enabled.root.paddingX,
    paddingBlock: vars.base.enabled.root.paddingY,

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

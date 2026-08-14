import { defineRecipe } from "../utils/define";
import { listHeader as vars } from "../vars/component";

const listHeader = defineRecipe({
  name: "list-header",
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: vars.base.rest.root.gap,
    justifyContent: "space-between",

    boxSizing: "border-box",

    paddingInline: vars.base.rest.root.paddingX,
    paddingBlock: vars.base.rest.root.paddingY,

    fontSize: vars.base.rest.root.fontSize,
    lineHeight: vars.base.rest.root.lineHeight,
  },
  variants: {
    variant: {
      mediumWeak: {
        fontWeight: vars.variantMediumWeak.rest.root.fontWeight,
        color: vars.variantMediumWeak.rest.root.color,
      },
      boldSolid: {
        fontWeight: vars.variantBoldSolid.rest.root.fontWeight,
        color: vars.variantBoldSolid.rest.root.color,
      },
    },
  },
  defaultVariants: {
    variant: "mediumWeak",
  },
});

export default listHeader;

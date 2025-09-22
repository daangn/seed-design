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

    paddingInline: vars.base.enabled.root.paddingX,
    paddingBlock: vars.base.enabled.root.paddingY,

    fontSize: vars.base.enabled.root.fontSize,
    lineHeight: vars.base.enabled.root.lineHeight,
    fontWeight: vars.base.enabled.root.fontWeight,
    color: vars.base.enabled.root.color,
  },
  variants: {},
  defaultVariants: {},
});

export default listHeader;

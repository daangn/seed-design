import { defineRecipe } from "../utils/define";
import { imageFrameIndicator as indicatorVars } from "../vars/component";

export default defineRecipe({
  name: "image-frame-indicator",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",

    backgroundColor: indicatorVars.base.rest.root.color,
    color: indicatorVars.base.rest.label.color,
    borderRadius: indicatorVars.base.rest.root.cornerRadius,

    paddingInline: indicatorVars.base.rest.root.paddingX,
    paddingBlock: indicatorVars.base.rest.root.paddingY,

    fontSize: indicatorVars.base.rest.label.fontSize,
    lineHeight: indicatorVars.base.rest.label.lineHeight,
    fontWeight: indicatorVars.base.rest.label.fontWeight,
  },
  variants: {},
  defaultVariants: {},
});

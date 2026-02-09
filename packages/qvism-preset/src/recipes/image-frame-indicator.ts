import { defineRecipe } from "../utils/define";
import { imageFrameIndicator as indicatorVars } from "../vars/component";

export default defineRecipe({
  name: "image-frame-indicator",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",

    backgroundColor: indicatorVars.base.enabled.root.color,
    color: indicatorVars.base.enabled.label.color,
    borderRadius: indicatorVars.base.enabled.root.cornerRadius,

    paddingLeft: indicatorVars.base.enabled.root.paddingX,
    paddingRight: indicatorVars.base.enabled.root.paddingX,
    paddingTop: indicatorVars.base.enabled.root.paddingY,
    paddingBottom: indicatorVars.base.enabled.root.paddingY,

    fontSize: indicatorVars.base.enabled.label.fontSize,
    lineHeight: indicatorVars.base.enabled.label.lineHeight,
    fontWeight: indicatorVars.base.enabled.label.fontWeight,
  },
  variants: {},
  defaultVariants: {},
});

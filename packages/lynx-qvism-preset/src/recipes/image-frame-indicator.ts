import { defineSlotRecipe } from "../utils/define";
import { imageFrameIndicator as vars } from "../vars/component";

export default defineSlotRecipe({
  name: "image-frame-indicator",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
    },
    label: {
      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
  },
  variants: {},
  defaultVariants: {},
});

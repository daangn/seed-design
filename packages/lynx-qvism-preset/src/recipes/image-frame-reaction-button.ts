import { defineSlotRecipe } from "../utils/define";
import { imageFrameReactionButton as vars } from "../vars/component";

export default defineSlotRecipe({
  name: "image-frame-reaction-button",
  slots: ["root", "fillIcon", "lineIcon"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
      width: vars.base.enabled.root.size,
      height: vars.base.enabled.root.size,
      backgroundColor: "transparent",
    },
    fillIcon: {
      width: vars.base.enabled.fillIcon.size,
      height: vars.base.enabled.fillIcon.size,
      pointerEvents: "none",
    },
    lineIcon: {
      width: vars.base.enabled.lineIcon.size,
      height: vars.base.enabled.lineIcon.size,
      pointerEvents: "none",
    },
  },
  variants: {},
  defaultVariants: {},
});

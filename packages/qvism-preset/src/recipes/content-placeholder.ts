import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "icon"],
  base: {
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "top",
      width: "100%",
      height: "100%",
      overflow: "hidden",

      padding: vars.base.enabled.root.padding,
      backgroundColor: vars.base.enabled.root.color,
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: "100%",
      height: "100%",
      minWidth: vars.base.enabled.icon.minWidth,
      maxWidth: vars.base.enabled.icon.maxWidth,
      color: vars.base.enabled.icon.color,
      fill: "currentColor",
      stroke: "currentColor",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default contentPlaceholder;

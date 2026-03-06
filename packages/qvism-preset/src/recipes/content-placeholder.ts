import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "container", "image"],
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

      backgroundColor: vars.base.enabled.root.color,
    },
    container: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      width: "100%",
      height: "100%",
      minWidth: vars.base.enabled.container.minWidth,
      maxWidth: vars.base.enabled.container.maxWidth,
      padding: vars.base.enabled.container.padding,
      marginLeft: "auto",
      marginRight: "auto",
    },
    image: {
      display: "block",
      width: "auto",
      height: "100%",
      maxWidth: "100%",
      aspectRatio: "1 / 1",
      marginLeft: "auto",
      marginRight: "auto",
      color: vars.base.enabled.image.color,
      fill: "currentColor",
      stroke: "currentColor",
    },
  },
  variants: {
    type: {
      default: {},
      buySell: {},
      car: {},
      coupon: {},
      food: {},
      group: {},
      image: {},
      jobs: {},
      localProfile: {},
      post: {},
      realty: {},
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export default contentPlaceholder;

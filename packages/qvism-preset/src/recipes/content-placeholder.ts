import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "image"],
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
    image: {
      display: "block",
      width: "50%",
      minWidth: vars.base.enabled.image.minWidth,
      maxWidth: vars.base.enabled.image.maxWidth,
      height: "auto",
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
      commerce: {},
      coupon: {},
      food: {},
      group: {},
      image: {},
      jobs: {},
      business: {},
      post: {},
      realty: {},
    },
  },
  defaultVariants: {
    type: "default",
  },
});

export default contentPlaceholder;

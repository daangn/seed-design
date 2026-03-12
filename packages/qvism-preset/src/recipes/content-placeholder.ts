import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "asset"],
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
    asset: {
      display: "block",
      height: `calc(${vars.base.enabled.asset.heightFraction} * 100%)`,
      minWidth: vars.base.enabled.asset.minWidth,
      maxWidth: vars.base.enabled.asset.maxWidth,
      color: vars.base.enabled.asset.color,
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

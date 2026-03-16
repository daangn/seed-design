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
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: `calc(${vars.base.enabled.asset.heightFraction} * 100%)`,
      minHeight: vars.base.enabled.asset.minWidth,
      maxHeight: vars.base.enabled.asset.maxWidth,
      width: "auto",
      aspectRatio: "1 / 1",
      color: vars.base.enabled.asset.color,

      "& > svg": {
        display: "block",
        width: "100%",
        height: "100%",
        fill: "currentColor",
        stroke: "currentColor",
      },

      "& > img": {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      },
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

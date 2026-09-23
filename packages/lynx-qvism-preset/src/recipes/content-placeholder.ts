import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "asset", "presetLight", "presetDark"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      backgroundColor: vars.base.enabled.root.color,
    },
    asset: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // root 높이의 heightFraction(0.5) 비율
      height: `calc(${vars.base.enabled.asset.heightFraction} * 100%)`,
      minWidth: vars.base.enabled.asset.minWidth,
      maxWidth: vars.base.enabled.asset.maxWidth,
      aspectRatio: "1 / 1",
    },
    presetLight: { width: "100%", height: "100%", display: "flex" },
    presetDark: { width: "100%", height: "100%", display: "none" },
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
  defaultVariants: { type: "default" },
});

export default contentPlaceholder;

import { skeleton as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const skeleton = defineRecipe({
  name: "skeleton",
  slots: ["root"],
  base: {
    root: {
      display: "inline-block",
      boxSizing: "border-box",
      overflow: "hidden",
      background: vars.base.enabled.root.color,

      "--seed-box-width": "initial",
      "--seed-box-height": "initial",
      width: "--seed-box-width",
      height: "--seed-box-height",

      "&::after": {
        content: "''",
        display: "block",
        width: "100%",
        height: "100%",

        backgroundImage: `linear-gradient(90deg, ${vars.base.enabled.shimmer.color})`,
        backgroundRepeat: "no-repeat",
        animationFillMode: "forwards",

        animationName: "slide-x",
        animationDuration: vars.base.enabled.shimmer.duration,
        animationTimingFunction: vars.base.enabled.shimmer.timingFunction,
        animationIterationCount: "infinite",
      },
    },
  },
  variants: {
    radius: {
      0: {
        root: {
          borderRadius: vars.radius0.enabled.root.cornerRadius,
        },
      },
      8: {
        root: {
          borderRadius: vars.radius8.enabled.root.cornerRadius,
        },
      },
      16: {
        root: {
          borderRadius: vars.radius16.enabled.root.cornerRadius,
        },
      },
      full: {
        root: {
          borderRadius: vars.radiusFull.enabled.root.cornerRadius,
        },
      },
    },
  },
  defaultVariants: {
    radius: 8,
  },
});

export default skeleton;

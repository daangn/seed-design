import { skeleton as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";

const skeleton = defineRecipe({
  name: "skeleton",
  base: {
    display: "inline-block",
    boxSizing: "border-box",
    overflow: "hidden",

    "--seed-box-width": "initial",
    "--seed-box-height": "initial",
    width: "var(--seed-box-width)",
    height: "var(--seed-box-height)",

    "&::after": {
      content: "''",
      display: "block",
      width: "100%",
      height: "100%",

      backgroundRepeat: "no-repeat",
      animationFillMode: "forwards",

      animationName: "slide-x",
      animationDuration: vars.base.enabled.shimmer.duration,
      animationTimingFunction: vars.base.enabled.shimmer.timingFunction,
      animationIterationCount: "infinite",
    },
  },
  variants: {
    radius: {
      0: {
        borderRadius: vars.radius0.enabled.root.cornerRadius,
      },
      8: {
        borderRadius: vars.radius8.enabled.root.cornerRadius,
      },
      16: {
        borderRadius: vars.radius16.enabled.root.cornerRadius,
      },
      full: {
        borderRadius: vars.radiusFull.enabled.root.cornerRadius,
      },
    },
    tone: {
      neutral: {
        background: vars.toneNeutral.enabled.root.color,

        "&::after": {
          backgroundImage: `linear-gradient(90deg, ${vars.toneNeutral.enabled.shimmer.gradient})`,
        },
      },
      magic: {
        background: vars.toneMagic.enabled.root.color,

        "&::after": {
          backgroundImage: `linear-gradient(90deg, ${vars.toneMagic.enabled.shimmer.gradient})`,
        },
      },
    },
  },
  defaultVariants: {
    radius: 8,
    tone: "neutral",
  },
});

export default skeleton;

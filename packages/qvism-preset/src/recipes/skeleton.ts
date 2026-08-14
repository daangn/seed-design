import { skeleton as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";
import spec from "@seed-design/rootage-artifacts/components/skeleton";

const skeleton = defineRecipe({
  name: "skeleton",
  base: {
    display: "inline-block",
    boxSizing: "border-box",
    overflow: "hidden",

    // real values, not `initial` — see https://webkit.org/b/241433
    "--seed-box-width--responsive": "auto",
    "--seed-box-height--responsive": "auto",
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
      animationDuration: vars.base.rest.shimmer.duration,
      animationTimingFunction: vars.base.rest.shimmer.timingFunction,
      animationIterationCount: "infinite",
    },
  },
  variants: {
    radius: {
      0: {
        borderRadius: vars.radius0.rest.root.cornerRadius,
      },
      8: {
        borderRadius: vars.radius8.rest.root.cornerRadius,
      },
      16: {
        borderRadius: vars.radius16.rest.root.cornerRadius,
      },
      full: {
        borderRadius: vars.radiusFull.rest.root.cornerRadius,
      },
    },
    tone: {
      neutral: {
        background: vars.toneNeutral.rest.root.color,

        "&::after": {
          backgroundImage: `linear-gradient(90deg, ${vars.toneNeutral.rest.shimmer.gradient})`,
        },
      },
      magic: {
        background: vars.toneMagic.rest.root.color,

        "&::after": {
          backgroundImage: `linear-gradient(90deg, ${vars.toneMagic.rest.shimmer.gradient})`,
        },
      },
    },
  },
  defaultVariants: {
    radius: 8,
    tone: "neutral",
  },
  metadata: {
    variants: {
      radius: spec.data.schema.variants.radius,
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default skeleton;

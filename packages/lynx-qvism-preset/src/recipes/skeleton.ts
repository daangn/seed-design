import { skeleton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import spec from "@seed-design/rootage-artifacts/components/skeleton";

const skeleton = defineSlotRecipe({
  name: "skeleton",
  slots: ["root", "shimmer"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
    },
    shimmer: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
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
    tone: {
      neutral: {
        root: {
          backgroundColor: vars.toneNeutral.enabled.root.color,
        },
        shimmer: {
          backgroundImage: `linear-gradient(90deg, ${vars.toneNeutral.enabled.shimmer.gradient.serialized})`,
        },
      },
      magic: {
        root: {
          backgroundColor: vars.toneMagic.enabled.root.color,
        },
        shimmer: {
          backgroundImage: `linear-gradient(90deg, ${vars.toneMagic.enabled.shimmer.gradient.serialized})`,
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

import spec from "@seed-design/rootage-artifacts/components/progress-circle";
import { progressCircle as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const progressCircle = defineSlotRecipe({
  name: "progress-circle",
  slots: ["root", "track", "range"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      position: "relative",

      "&[data-progress-state=indeterminate]": {
        animation: `rotate ${vars.indeterminateTrue.rest.range.rotateDuration} ${vars.indeterminateTrue.rest.range.rotateTimingFunction} infinite`,
      },
    },
    track: {
      stroke: "var(--track-color)",
    },
    range: {
      stroke: "var(--range-color)",
      strokeLinecap: "round",

      // determinate
      transitionDuration: vars.indeterminateFalse.rest.range.lengthDuration,
      transitionTimingFunction: vars.indeterminateFalse.rest.range.lengthTimingFunction,
      transitionProperty: "stroke-dasharray",

      // indeterminate
      "&[data-progress-state=indeterminate]": {
        animation: `
          progress-circle-head ${vars.indeterminateTrue.rest.range.lengthDuration} ${vars.indeterminateTrue.rest.range.headTimingFunction} infinite normal none running,
          progress-circle-tail ${vars.indeterminateTrue.rest.range.lengthDuration} ${vars.indeterminateTrue.rest.range.tailTimingFunction} infinite normal none running
        `,
      },
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          "--track-color": vars.toneNeutral.rest.track.color,
          "--range-color": vars.toneNeutral.rest.range.color,
        },
      },
      brand: {
        root: {
          "--track-color": vars.toneBrand.rest.track.color,
          "--range-color": vars.toneBrand.rest.range.color,
        },
      },
      staticWhite: {
        root: {
          "--track-color": vars.toneStaticWhite.rest.track.color,
          "--range-color": vars.toneStaticWhite.rest.range.color,
        },
      },
      inherit: {
        root: {},
      },
    },
    size: {
      24: {
        root: {
          "--size": vars.size24.rest.root.size,
          "--thickness": vars.size24.rest.root.thickness,
        },
      },
      40: {
        root: {
          "--size": vars.size40.rest.root.size,
          "--thickness": vars.size40.rest.root.thickness,
        },
      },
      inherit: {
        root: {},
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: 40,
  },
  metadata: {
    variants: {
      tone: spec.data.schema.variants.tone,
      size: spec.data.schema.variants.size,
    },
  },
});

export default progressCircle;

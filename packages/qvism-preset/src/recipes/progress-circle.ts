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
        animation: `rotate ${vars.indeterminateTrue.enabled.range.rotateDuration} ${vars.indeterminateTrue.enabled.range.rotateTimingFunction} infinite`,
      },
    },
    track: {
      stroke: "var(--track-color)",
    },
    range: {
      stroke: "var(--range-color)",
      strokeLinecap: "round",

      // determinate
      transitionDuration: vars.indeterminateFalse.enabled.range.lengthDuration,
      transitionTimingFunction: vars.indeterminateFalse.enabled.range.lengthTimingFunction,
      transitionProperty: "stroke-dasharray",

      // indeterminate
      "&[data-progress-state=indeterminate]": {
        animation: `
          progress-circle-head ${vars.indeterminateTrue.enabled.range.lengthDuration} ${vars.indeterminateTrue.enabled.range.headTimingFunction} infinite normal none running,
          progress-circle-tail ${vars.indeterminateTrue.enabled.range.lengthDuration} ${vars.indeterminateTrue.enabled.range.tailTimingFunction} infinite normal none running
        `,
      },
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          "--track-color": vars.toneNeutral.enabled.track.color,
          "--range-color": vars.toneNeutral.enabled.range.color,
        },
      },
      brand: {
        root: {
          "--track-color": vars.toneBrand.enabled.track.color,
          "--range-color": vars.toneBrand.enabled.range.color,
        },
      },
      staticWhite: {
        root: {
          "--track-color": vars.toneStaticWhite.enabled.track.color,
          "--range-color": vars.toneStaticWhite.enabled.range.color,
        },
      },
      inherit: {
        root: {},
      },
    },
    size: {
      24: {
        root: {
          "--size": vars.size24.enabled.root.size,
          "--thickness": vars.size24.enabled.root.thickness,
        },
      },
      40: {
        root: {
          "--size": vars.size40.enabled.root.size,
          "--thickness": vars.size40.enabled.root.thickness,
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
});

export default progressCircle;

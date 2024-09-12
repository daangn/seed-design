import { vars } from "./__generated__/progress-circle.vars";
import { defineRecipe } from "./helper";
// import { disabled, focus, active, pseudo } from "./pseudo";

const progressCircle = defineRecipe({
  name: "progressCircle",
  slots: ["root", "track", "indicator", "indicator-path"],
  base: {
    root: {
      display: "inline-block",
      position: "relative",
    },
    track: {
      position: "absolute",
      inset: 0,

      width: "100%",
      height: "100%",

      fill: vars.base.enabled.track.fill,
    },
    indicator: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",

      position: "absolute",
      inset: 0,

      width: "100%",
      height: "100%",

      color: vars.base.enabled.indicator.color,
    },
    "indicator-path": {
      stroke: "currentColor",
      strokeDasharray: "80, 200",
      strokeDashoffset: "0",
      strokeLinecap: "round",
      strokeWidth: "5.2px",

      rotate: "-90deg",
      transformOrigin: "center",
      transformBox: "fill-box",
    },
  },
  variants: {
    size: {
      small: {
        root: {
          width: vars.sizeSmall.enabled.root.size,
          height: vars.sizeSmall.enabled.root.size,
        },
      },
      medium: {
        root: {
          width: vars.sizeMedium.enabled.root.size,
          height: vars.sizeMedium.enabled.root.size,
        },
      },
    },
    variant: {
      indeterminate: {
        root: {
          animation: `rotate ${vars.variantIndeterminate.enabled["indicator-path"].rotateDuration} ${vars.variantIndeterminate.enabled["indicator-path"].rotateTimingFunction} infinite`,
        },
        "indicator-path": {
          animation: `
            headDash ${vars.variantIndeterminate.enabled["indicator-path"].headDashDuration} ${vars.variantIndeterminate.enabled["indicator-path"].headDashTimingFunction} infinite normal none running,
            tailDash ${vars.variantIndeterminate.enabled["indicator-path"].tailDashDuration} ${vars.variantIndeterminate.enabled["indicator-path"].tailDashTimingFunction} infinite normal none running
          `,
        },
      },
      determinate: {
        "indicator-path": {
          transitionDuration: `var(--seed-spinner-determinate-duration, ${vars.variantDeterminate.enabled["indicator-path"].transitionDuration})`,
          transitionTimingFunction: `var(--seed-spinner-determinate-timing-function, ${vars.variantDeterminate.enabled["indicator-path"].transitionTimingFunction})`,
          transitionProperty: "stroke-dasharray",
        },
      },
    },
  },
  keyframes: {
    rotate: {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },

    headDash: {
      "0%": {
        strokeDasharray: "1, 200",
      },
      "75%": {
        strokeDasharray: "112, 200",
      },
      "100%": {
        strokeDasharray: "112, 200",
      },
    },

    tailDash: {
      "0%": {
        strokeDashoffset: "0",
      },
      "33.3%": {
        strokeDashoffset: "0",
      },
      "100%": {
        strokeDashoffset: "-110",
      },
    },
  },
});

export default progressCircle;

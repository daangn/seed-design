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
          "--seed-spinner-indeterminate-duration": "1.2s",
          "--seed-spinner-indeterminate-timing-function": "cubic-bezier(0.35, 0.25, 0.65, 0.75)",

          animation:
            "rotate var(--seed-spinner-indeterminate-duration) var(--seed-spinner-indeterminate-timing-function) 0s infinite normal none running",
        },
        "indicator-path": {
          "--seed-spinner-indeterminate-head-dash-timing-function":
            "cubic-bezier(0.35, 0, 0.65, 1)",
          "--seed-spinner-indeterminate-tail-dash-timing-function":
            "cubic-bezier(0.35, 0, 0.65, 0.6)",

          animation: `
            headDash var(--seed-spinner-indeterminate-duration) var(--seed-spinner-indeterminate-head-dash-timing-function) 0s infinite normal none running,
            tailDash var(--seed-spinner-indeterminate-duration) var(--seed-spinner-indeterminate-tail-dash-timing-function) 0s infinite normal none running
          `,
        },
      },
      determinate: {
        "indicator-path": {
          transition:
            "stroke-dasharray var(--seed-spinner-determinate-duration, 0.3s) var(--seed-spinner-determinate-timing-function, cubic-bezier(0.35, 0.25, 0.65, 0.75)) 0s",
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

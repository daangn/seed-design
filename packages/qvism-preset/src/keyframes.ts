import { defineKeyframes } from "./utils/define";

export const keyframes = defineKeyframes({
  "ride-enter": {
    from: {
      opacity: "var(--ride-enter-opacity, 1)",
      transform: `translate3d(var(--ride-enter-translate-x, 0), var(--ride-enter-translate-y, 0), 0)
      scale3d(var(--ride-enter-scale, 1), var(--ride-enter-scale, 1), var(--ride-enter-scale, 1))
      rotate(var(--ride-enter-rotate, 0))`,
    },
  },

  "ride-exit": {
    to: {
      opacity: "var(--ride-exit-opacity, 1)",
      transform: `translate3d(var(--ride-exit-translate-x, 0), var(--ride-exit-translate-y, 0), 0)
      scale3d(var(--ride-exit-scale, 1), var(--ride-exit-scale, 1), var(--ride-exit-scale, 1))
      rotate(var(--ride-exit-rotate, 0))`,
    },
  },

  rotate: {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },

  "slide-x": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },

  "progress-circle-head": {
    "0%": {
      strokeDasharray: "0, 1000%",
    },
    "75%": {
      strokeDasharray: "var(--circumference), 1000%",
    },
    "100%": {
      strokeDasharray: "var(--circumference), 1000%",
    },
  },

  "progress-circle-tail": {
    "0%": {
      strokeDashoffset: 0,
    },
    "33.33%": {
      strokeDashoffset: 0,
    },
    "100%": {
      strokeDashoffset: "calc(var(--circumference) * -1)",
    },
  },

  "fade-in": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },

  "fade-out": {
    to: {
      opacity: 0,
    },
  },

  "drawer-slide-from-bottom": {
    from: {
      transform: "translate3d(0, var(--initial-transform, 100%), 0)",
    },
    to: {
      transform: "translate3d(0, var(--snap-point-height, 0), 0)",
    },
  },

  "drawer-slide-to-bottom": {
    to: {
      transform: "translate3d(0, var(--initial-transform, 100%), 0)",
    },
  },
});

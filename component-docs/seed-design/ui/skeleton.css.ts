import { keyframes } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// #F7F8F9
// #F7F8F950
const wave = keyframes({
  "0%": {
    backgroundPositionX: "100%",
  },

  "50%": {
    backgroundPositionX: "100%",
  },

  "100%": {
    backgroundPositionX: "-100%",
  },
});

export const skeleton = recipe({
  base: {},

  variants: {
    type: {
      wave: {
        backgroundImage:
          "var(--skeleton-gradient, linear-gradient(90deg, #F7F8F9 0%, #F7F8F950 20%, #F7F8F9 40%))",
        backgroundSize: "200% 100%",
        animationFillMode: "forwards",

        animationName: wave,
        animationDuration: "var(--skeleton-animation-duration, 1.5s)",
        animationTimingFunction: "var(--skeleton-animation-timing-function, ease-in-out)",
        animationIterationCount: "infinite",
      },
    },

    borderRadius: {
      circle: {
        borderRadius: "50%",
      },
      rounded: {
        borderRadius: "4px",
      },
      square: {
        borderRadius: "0px",
      },
    },
  },
});

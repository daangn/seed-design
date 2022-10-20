import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as u from "../styles/utils.css";

const TRANSITION_DURATION = "0.25s";
const TRANSITION_TIMING_FUNCTION = "ease";

export const drawerButton = style([
  u.cursorPointer,
  u.middleLayer,
  {
    position: "fixed",
    top: 0,
    left: 0,
    margin: "10px",
  },
]);

export const drawer = recipe({
  base: [
    u.flexColumn,
    {
      position: "fixed",
      top: 0,
      left: 0,

      transition: `transform ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}, z-index ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}`,

      width: "300px",
      height: "100vh",

      backgroundColor: vars.$scale.color.green800,
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
    },
  ],

  variants: {
    open: {
      true: [
        u.topLayer,
        {
          transform: "translateX(0px)",
        },
      ],
      false: [
        u.backLayer,
        {
          transform: "translateX(-300px)",
        },
      ],
    },
  },
});

export const overlay = recipe({
  base: [
    u.flexColumnCenter,
    {
      position: "fixed",
      top: 0,
      left: 0,

      width: "100vw",
      height: "100vh",

      backgroundColor: vars.$scale.color.gray900,
      transition: `opacity ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}, z-index ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}`,
    },
  ],

  variants: {
    open: {
      true: [
        u.middleLayer,
        {
          opacity: 0.6,
        },
      ],
      false: [
        u.backLayer,
        {
          opacity: 0,
        },
      ],
    },
  },
});

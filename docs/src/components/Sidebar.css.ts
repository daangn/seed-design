import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

const TRANSITION_DURATION = "0.25s";
const TRANSITION_TIMING_FUNCTION = "ease";

export const categoryTitle = style({
  fontSize: "26px",
  fontWeight: 700,
  padding: "20px",
  transition: "color 0.2s ease",
  color: vars.$scale.color.gray900,

  ":hover": {
    color: vars.$semantic.color.primaryHover,
  },
});

export const logo = style([
  u.cursorPointer,
  {
    fontSize: "28px",
    fontWeight: 700,
    padding: "10px",
    margin: "8px",
    color: vars.$scale.color.gray900,
    borderRadius: "10px",
    transition: "color 0.2s ease",

    ":hover": {
      color: vars.$semantic.color.primaryHover,
    },
  },
]);

export const sidebarTitleLink = recipe({
  base: [
    {
      margin: "8px",
      borderRadius: "10px",
      color: vars.$scale.color.gray900,
      transition: "color 0.2s ease",

      ":hover": {
        color: vars.$semantic.color.primaryHover,
      },
    },
  ],

  variants: {
    highlight: {
      true: [
        {
          color: vars.$semantic.color.primary,
        },
      ],
    },
  },
});

export const sidebarLink = recipe({
  base: [
    u.flexAlignCenter,
    {
      columnGap: "10px",
      padding: "10px",
      margin: "8px",
      borderRadius: "10px",
      color: vars.$scale.color.gray900,
      transition: "color 0.2s ease",

      ":hover": {
        color: vars.$semantic.color.primaryHover,
      },
    },
  ],

  variants: {
    highlight: {
      true: [
        {
          color: vars.$semantic.color.primary,
        },
      ],
    },
  },
});

export const sidebarButton = style([
  u.cursorPointer,
  u.middleLayer,
  {
    margin: "20px",
    padding: "6px",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    transition: "background-color 0.2s ease",

    ":hover": {
      backgroundColor: vars.$scale.color.gray200,
    },
  },
]);

export const sidebar = recipe({
  base: [
    u.flexColumn,
    {
      position: "fixed",
      top: 0,
      left: 0,

      transition: `
        transform ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION},
        z-index ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}
      `,

      width: "300px",
      height: "100vh",

      backgroundColor: vars.$scale.color.gray00,
    },
  ],

  variants: {
    open: {
      true: [u.topLayer],
      false: [u.backLayer],
    },
  },
});

export const overlay = recipe({
  base: [
    u.flexCenter,
    {
      position: "fixed",
      top: 0,
      right: 0,

      height: "100vh",

      transition: `
        backgroundColor ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION},
        opacity ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION},
        z-index ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION},
        width ${TRANSITION_DURATION} ${TRANSITION_TIMING_FUNCTION}
      `,
    },
  ],

  variants: {
    open: {
      true: [
        u.middleLayer,
        {
          backgroundColor: vars.$scale.color.grayAlpha500,
          opacity: 1,
          width: "calc(100vw - 300px)",
        },
      ],
      false: [
        u.backLayer,
        {
          backgroundColor: undefined,
          opacity: 0,
          width: "100vw",
        },
      ],
    },
  },
});

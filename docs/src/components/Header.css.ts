import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

export const header = recipe({
  base: [
    u.middleLayer,
    {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: vars.$semantic.color.paperDefault,

      width: "100%",
      height: "90px",

      transition: "box-shadow 0.3s ease",
    },
  ],
  variants: {
    isTop: {
      true: {
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.03)",
      },
    },
  },
});

export const content = style([
  u.flexAlignCenter,
  {
    justifyContent: "space-between",

    width: "100%",
    height: "100%",
    maxWidth: "1400px",

    margin: "auto",
    padding: "0 10px",
    gap: "10px",

    transition: "box-shadow 0.3s ease",
  },

  m.large({
    padding: "0 20px",
  }),
]);

export const headerRightSection = style([
  u.flexAlignCenter,
  {
    gap: "16px",
  },
]);

export const sidebarToggleButton = style([
  u.cursorPointer,
  u.middleLayer,
  {
    padding: "6px",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    transition: "background-color 0.2s ease",

    ":hover": {
      backgroundColor: vars.$scale.color.gray200,
    },
  },

  m.large({
    display: "none",
  }),
]);

export const githubLogo = style([
  u.cursorPointer,
  {
    width: "26px",
    height: "26px",
  },
]);

export const searchButton = style([
  u.cursorPointer,
  u.flexCenter,
  {
    width: "135px",
    height: "36px",

    borderRadius: "6px",
    padding: "6px",

    gap: "6px",

    backgroundColor: vars.$semantic.color.paperDefault,
    border: `1px ${vars.$scale.color.gray300} solid`,

    transition: "border 0.2s ease",

    ":hover": {
      border: `1px solid ${vars.$scale.color.gray600}`,
    },
  },
]);

export const searchButtonLeftIcon = style([
  {
    width: "16px",
    height: "16px",

    color: vars.$scale.color.gray800,
  },
]);

export const searchButtonText = style({
  fontSize: "14px",
  color: vars.$scale.color.gray800,
});

export const searchButtonKeyboard = style([
  u.flex,
  {
    fontSize: "12px",

    color: vars.$scale.color.gray500,
    backgroundColor: vars.$scale.color.gray50,

    borderRadius: "4px",

    padding: "2px 4px",
    paddingRight: "6px",
    gap: "4px",
  },
]);

export const logo = style([
  u.cursorPointer,
  {
    transform: "scale(0.75)",
  },

  m.large({
    transform: "scale(1.0)",
  }),
]);

export const logoCircle = style([
  {
    fill: vars.$scale.color.gray900,
  },
]);

export const logoText = style([
  {
    stroke: vars.$scale.color.gray900,
  },
]);

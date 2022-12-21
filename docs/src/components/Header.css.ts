import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

export const header = style([
  u.flexAlignCenter,
  u.middleLayer,
  {
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,

    width: "100%",
    maxWidth: "1400px",
    height: "76px",

    margin: "auto",
    padding: "0 10px",
    gap: "10px",

    backdropFilter: "blur(5px)",
  },

  m.large({
    padding: "0 20px",
    gap: "20px",
  }),
]);

export const headerRightSection = style([
  u.flexAlignCenter,
  {
    gap: "10px",
  },
]);

export const sidebarToggleButton = style([
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

  m.large({
    display: "none",
  }),
]);

export const searchButtonLeftIcon = style([
  {
    position: "absolute",
    top: "50%",
    left: "8px",
    transform: "translateY(-50%)",

    width: "20px",
    height: "20px",

    color: vars.$scale.color.gray500,
  },

  m.large({
    left: "16px",

    width: "24px",
    height: "24px",
  }),
]);

export const searchButton = style([
  u.cursorPointer,
  {
    position: "relative",

    width: "200px",
    height: "36px",

    fontSize: "26px",

    border: "none",
    borderRadius: "12px",

    backgroundColor: vars.$scale.color.gray50,
  },

  m.large({
    height: "46px",
    width: "300px",
  }),
]);

export const searchButtonRight = style([
  u.flex,
  {
    color: vars.$scale.color.gray500,
    fontSize: "14px",

    position: "absolute",
    top: "50%",
    right: "8px",
    transform: "translateY(-50%)",

    padding: "2px 4px",
    paddingRight: "6px",
    gap: "4px",
  },

  m.large({
    right: "16px",
    fontSize: "18px",
  }),
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

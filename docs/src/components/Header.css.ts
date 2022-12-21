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

    margin: "auto",

    width: "100%",
    maxWidth: "1400px",
    height: "76px",

    padding: "0 10px",

    backdropFilter: "blur(5px)",
  },

  m.large({
    padding: "0 30px",
  }),
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

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

const SIDEBAR_WIDTH = "250px";

export const sidebar = style([
  u.flexColumn,
  u.topLayer,

  {
    position: "fixed",
    top: 0,

    background: vars.$semantic.color.paperDefault,
    paddingLeft: "20px",

    width: SIDEBAR_WIDTH,
    height: "100vh",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },

  m.large({
    display: "none",
  }),
]);

export const sidebarDesktop = style([
  sidebar,

  {
    display: "none",
  },

  m.large({
    display: "flex",
    position: "sticky",
    top: 110,
    left: 0,
    paddingLeft: "30px",
    height: "calc(100vh - 110px)",
  }),
]);

export const sidebarLogo = style([
  {
    paddingLeft: "10px",
    marginBottom: "40px",
  },
]);

export const sidebarItemContainer = style([
  u.flexColumn,
  {
    position: "absolute",
    top: 30,

    height: "calc(100vh - 150px)",
    overflowY: "auto",
  },

  m.large({
    top: 0,
  }),
]);

export const sidebarTitle1 = style([
  {
    fontSize: "24px",
    fontWeight: 700,

    width: `calc(${SIDEBAR_WIDTH} - 20px)`,
    transition: "color 0.2s ease",
    color: vars.$scale.color.gray900,
    paddingLeft: "10px",
    marginTop: "40px",
    marginBottom: "4px",
  },
]);

export const sidebarTitle2 = style([
  {
    fontSize: "20px",
    fontWeight: 700,

    width: `calc(${SIDEBAR_WIDTH} - 20px)`,
    transition: "color 0.2s ease",
    color: vars.$scale.color.gray900,
    paddingLeft: "10px",
    marginTop: "24px",
    marginBottom: "4px",

    ":hover": {
      color: vars.$scale.color.gray600,
    },
  },
]);

export const sidebarItem = recipe({
  base: [
    u.flexAlignCenter,
    {
      width: `calc(${SIDEBAR_WIDTH} - 56px)`,
      height: "32px",
      fontSize: "16px",
      color: vars.$scale.color.gray600,
      transition: "background 0.2s ease",
      paddingLeft: "10px",
      marginTop: "6px",
      borderRadius: "4px",

      ":hover": {
        backgroundColor: vars.$scale.color.grayAlpha50,
      },
    },
  ],

  variants: {
    highlight: {
      true: [
        {
          fontWeight: "bold",
          color: vars.$semantic.color.primary,
          backgroundColor: vars.$semantic.color.primaryLow,

          ":hover": {
            backgroundColor: vars.$semantic.color.primaryLowActive,
          },
        },
      ],
    },
  },
});

export const overlay = style([
  u.flexCenter,
  u.middleLayer,
  {
    position: "fixed",
    top: 0,
    right: 0,

    height: "100vh",
    width: "100vw",

    backgroundColor: vars.$semantic.color.overlayDim,
    backdropFilter: "blur(2px)",
  },

  m.large({
    display: "none",
  }),
]);

import { vars } from "@seed-design/design-token";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

const SIDEBAR_WIDTH = "270px";
const SIDEBAR_ITEM_WIDTH = `calc(${SIDEBAR_WIDTH} - 34px)`;

const slideIn = keyframes({
  "0%": {
    transform: "translateX(-80px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateX(0)",
    opacity: 1,
  },
});

const sidebarItemBase = style([
  u.flexAlignCenter,
  {
    width: SIDEBAR_ITEM_WIDTH,
    height: "32px",
    fontSize: "16px",
    fontWeight: "500",
    color: vars.$scale.color.gray600,
    transition: "background 0.2s ease",
    paddingLeft: "10px",
    marginTop: "6px",
    borderRadius: "4px",

    ":hover": {
      backgroundColor: vars.$scale.color.grayAlpha50,
    },
  },
]);

export const sidebar = recipe({
  base: [
    u.flexColumn,
    u.topLayer,

    {
      position: "fixed",
      top: 0,

      animation: `${slideIn} 0.2s ease`,
      background: vars.$semantic.color.paperDefault,
      paddingLeft: "6px",

      width: SIDEBAR_WIDTH,
      height: "100vh",
      transition:
        "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
    },

    m.large({
      display: "none",
    }),
  ],

  variants: {
    open: {
      true: {
        opacity: 1,
        transform: "translateX(0)",
      },
      false: {
        opacity: 0,
        transform: "translateX(-80px)",
      },
    },
  },
});

export const sidebarDesktop = style([
  u.flexColumn,
  u.topLayer,
  {
    display: "none",
    position: "fixed",
    top: 0,

    background: vars.$semantic.color.paperDefault,

    width: SIDEBAR_WIDTH,
    height: "100vh",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },

  m.large({
    display: "flex",
    position: "sticky",
    top: 80,
    left: 0,

    height: "calc(100vh - 80px)",
    zIndex: 1,
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

    paddingTop: "30px",
    paddingBottom: "30px",
    paddingLeft: "10px",
    paddingRight: "20px",

    height: "100%",
    overflowY: "auto",
    overscrollBehavior: "contain",
  },

  m.medium({
    marginLeft: "20px",
  }),

  m.large({
    top: 0,
  }),
]);

export const sidebarTitle = style([
  {
    fontSize: "24px",
    fontWeight: 700,

    width: SIDEBAR_ITEM_WIDTH,
    transition: "color 0.2s ease",
    color: vars.$scale.color.gray900,
    paddingLeft: "10px",
    marginTop: "40px",
    marginBottom: "4px",
  },
]);

export const sidebarCollapseIcon = recipe({
  base: [
    {
      transition: "transform 0.2s ease",
    },
  ],
  variants: {
    open: {
      true: {
        transform: "rotate(0deg)",
      },
      false: {
        transform: "rotate(180deg)",
      },
    },
  },
});

export const sidebarCollapseTitleContainer = style([
  sidebarItemBase,
  {
    cursor: "pointer",
    justifyContent: "space-between",
  },
]);

export const sidebarCollapseTitleIcon = style({
  width: "16px",
  height: "16px",
  marginRight: "10px",
});

export const sidebarCollapseContainer = style([
  u.flexColumnCenter,
  {
    width: SIDEBAR_ITEM_WIDTH,
    marginTop: "0",
    marginBottom: "0",
    borderRadius: "4px",

    paddingInlineStart: "0px",
  },
]);

export const sidebarCollapseTitle = style([
  {
    fontWeight: "500",
    userSelect: "none",
  },
]);

export const sidebarCollapse = recipe({
  base: [
    {
      transition: "height 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
    },
  ],
  variants: {
    open: {
      true: {
        height: "auto",
        opacity: 1,
        transform: "translateY(0)",
      },
      false: {
        height: 0,
        opacity: 0,
        transform: "translateY(-20px)",
      },
    },
  },
});

export const sidebarItem = recipe({
  base: [
    sidebarItemBase,
    {
      paddingLeft: "13px",
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

    disable: {
      true: {
        color: vars.$scale.color.gray400,
      },
    },

    hasDeps: {
      true: {
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
  },
});

export const sidebarItemLink = recipe({
  variants: {
    disable: {
      true: {
        pointerEvents: "none",
      },
    },
  },
});

export const overlay = recipe({
  base: [
    u.flexCenter,
    u.middleLayer,
    {
      position: "fixed",
      top: 0,
      right: 0,

      height: "100%",
      width: "100vw",

      transition: "opacity 0.2s ease",
      backgroundColor: vars.$semantic.color.overlayDim,
      backdropFilter: "blur(2px)",
    },

    m.large({
      display: "none",
    }),
  ],

  variants: {
    open: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});

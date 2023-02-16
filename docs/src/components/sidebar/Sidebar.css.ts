import { vars } from "@seed-design/design-token";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { COMMON_STYLES } from "../../constants";
import * as m from "../../styles/media.css";
import * as u from "../../styles/utils.css";

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

export const sidebarItemBase = style([
  u.flexAlignCenter,
  {
    width: COMMON_STYLES.SIDEBAR_ITEM_WIDTH,
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

export const mobileSidebarContainer = recipe({
  base: [
    u.flexColumn,
    u.topLayer,

    {
      position: "fixed",
      top: 0,

      animation: `${slideIn} 0.2s ease`,
      background: vars.$semantic.color.paperDefault,
      paddingLeft: "6px",

      width: `calc(${COMMON_STYLES.SIDEBAR_WIDTH} + 6px)`,
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

export const desktopSidebarContainer = style([
  u.flexColumn,
  u.topLayer,
  {
    display: "none",
    position: "fixed",
    top: 0,

    background: vars.$semantic.color.paperDefault,

    width: COMMON_STYLES.SIDEBAR_WIDTH,
    height: "100vh",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },

  m.medium({
    marginLeft: "20px",
  }),

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

  m.large({
    top: 0,
  }),
]);

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

import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { COMMON_STYLES } from "../../constants";
import * as u from "../../styles/utils.css";
import { sidebarItemBase } from "./Sidebar.css";

export const container = style([
  u.flexColumnCenter,
  {
    width: COMMON_STYLES.SIDEBAR_ITEM_WIDTH,
    marginTop: "0",
    marginBottom: "0",
    borderRadius: "4px",

    paddingInlineStart: "0px",
  },
]);

export const topContainer = style([
  sidebarItemBase,
  {
    cursor: "pointer",
    justifyContent: "space-between",
  },
]);

export const title = style([
  {
    fontWeight: "500",
    userSelect: "none",
  },
]);

export const icon = recipe({
  base: [
    {
      transition: "transform 0.2s ease",
      marginRight: "10px",
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

export const collapseItemContainer = recipe({
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

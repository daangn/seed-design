import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

export const bottomLine = style({
  width: "100%",
  height: "1px",
  backgroundColor: vars.$scale.color.gray200,
});

export const navContainer = style([
  u.flexAlignCenter,
  {
    marginTop: "70px",
    gap: "20px",
  },

  m.large({
    position: "sticky",
    top: "20px",
    zIndex: 50,
  }),
]);

export const navLink = recipe({
  base: [
    u.flexAlignCenter,
    u.cursorPointer,
    {
      fontSize: "14px",
      fontWeight: "bold",

      paddingBottom: "8px",
      margin: "0 8px",

      transition: "background-color 0.2s ease",

      color: vars.$scale.color.gray500,
    },
  ],
  variants: {
    active: {
      true: {
        position: "relative",
        color: vars.$scale.color.gray700,
        selectors: {
          "&::after": {
            content: "",
            position: "absolute",
            width: "100%",
            borderBottom: `3px solid ${vars.$scale.color.gray700}`,
            bottom: "-1px",
          },
        },
      },
      false: {
        ":hover": {
          color: vars.$scale.color.gray600,
        },
      },
    },
  },
});

export const navLinkText = style([
  {
    position: "relative",
    fontSize: "20px",
  },
]);

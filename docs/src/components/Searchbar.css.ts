import { vars } from "@seed-design/design-token";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as u from "../styles/utils.css";

const fade = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

export const container = recipe({
  base: [
    u.fullScreen,
    u.modalLayer,
    {
      position: "fixed",
      top: 0,
      left: 0,

      animation: `${fade} 0.2s ease`,
      backgroundColor: vars.$scale.color.grayAlpha500,
    },
  ],
  variants: {
    open: {
      true: [
        {
          display: "flex",
        },
      ],
      false: [
        {
          display: "none",
        },
      ],
    },
  },
});

export const content = style([
  u.flexColumnCenter,
  {
    position: "absolute",
    top: "130px",
    left: "50%",
    transform: "translateX(-50%)",

    width: "600px",

    backgroundColor: vars.$scale.color.gray100,

    borderRadius: "8px",

    padding: "8px",
  },
]);

export const input = style({
  width: "100%",
  height: "60px",

  backgroundColor: vars.$scale.color.gray200,

  fontSize: "24px",

  border: "none",
  borderRadius: "8px",

  paddingInlineStart: "16px",
  paddingInlineEnd: "16px",
});

export const list = style([
  u.flexColumn,
  {
    width: "100%",
    maxHeight: "60vh",
    overflowY: "auto",
    rowGap: "8px",

    marginBlockEnd: "0",
    paddingInlineStart: "0",
  },
]);

export const listItem = style([
  u.flexAlignCenter,
  {
    width: "100%",
    height: "60px",

    borderRadius: "8px",

    color: vars.$semantic.color.inkText,
    backgroundColor: vars.$scale.color.gray300,

    paddingInlineStart: "16px",
    paddingInlineEnd: "16px",

    ":hover": {
      backgroundColor: vars.$semantic.color.primaryHover,
      color: vars.$scale.color.gray00,
    },
  },
]);

export const listItemHighlight = style({
  fontWeight: "bold",
  textDecoration: "underline",
});

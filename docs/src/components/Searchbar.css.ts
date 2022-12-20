import { vars } from "@seed-design/design-token";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as u from "../styles/utils.css";

const fade = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(-10px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0px)",
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
      backdropFilter: "blur(2px)",
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

    borderRadius: "12px",

    backgroundColor: vars.$scale.color.gray00,

    padding: "8px",
  },
]);

export const inputContainer = style([
  u.flexJustifyCenter,
  {
    position: "relative",
    width: "95%",
    height: "78px",
  },
]);

export const inputLeftIcon = style([
  {
    position: "absolute",
    top: "50%",
    left: "8px",
    transform: "translateY(-50%)",

    width: "24px",
    height: "24px",

    color: vars.$scale.color.gray500,
  },
]);

export const input = recipe({
  base: {
    width: "100%",
    height: "100%",
    fontSize: "26px",

    border: "none",

    backgroundColor: vars.$scale.color.gray00,

    paddingInlineStart: "48px",
    paddingInlineEnd: "16px",

    ":focus": {
      outline: "none",
    },
  },
  variants: {
    underline: {
      true: {
        borderBottom: `1px solid ${vars.$scale.color.gray300}`,
      },
    },
  },
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
  u.flexColumn,
  {
    justifyContent: "center",

    width: "100%",
    height: "78px",

    borderRadius: "10px",

    paddingInlineStart: "16px",
    paddingInlineEnd: "16px",
    rowGap: "4px",

    ":hover": {
      backgroundColor: vars.$scale.color.gray50,
    },
  },
]);

export const listItemTitle = style({
  fontSize: "22px",
  color: vars.$scale.color.gray900,
});

export const listItemDescription = style({
  fontSize: "16px",
  color: vars.$scale.color.gray600,
});

export const listItemHighlight = style({
  fontWeight: "bold",
  color: vars.$scale.color.gray900,
});

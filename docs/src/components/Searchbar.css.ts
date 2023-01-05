import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

export const container = style([
  u.fullScreen,
  u.modalLayer,
  {
    position: "fixed",
    top: 0,
    left: 0,

    backgroundColor: vars.$semantic.color.overlayDim,
    backdropFilter: "blur(2px)",
  },
]);

export const content = style([
  u.flexColumnCenter,
  {
    position: "absolute",
    top: "130px",
    left: "50%",
    transform: "translateX(-50%)",

    width: "90vw",

    borderRadius: "12px",

    backgroundColor: vars.$scale.color.gray00,

    padding: "8px",
  },

  m.medium({
    width: "600px",
  }),
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

export const inputRight = style([
  u.flex,
  {
    color: vars.$scale.color.gray500,
    fontSize: "16px",

    position: "absolute",
    top: "50%",
    right: "8px",
    transform: "translateY(-50%)",

    border: `1px solid ${vars.$scale.color.gray500}`,
    borderRadius: "4px",

    padding: "4px 8px",
    paddingRight: "10px",
    gap: "4px",
  },
]);

export const input = recipe({
  base: {
    width: "100%",
    height: "100%",
    fontSize: "26px",

    border: "none",

    backgroundColor: vars.$scale.color.gray00,
    color: vars.$scale.color.gray900,

    paddingInlineStart: "48px",
    paddingInlineEnd: "78px",

    ":focus": {
      outline: "none",
    },
    "::placeholder": {
      color: vars.$scale.color.gray400,
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

export const list = recipe({
  base: [
    u.flexColumn,
    {
      width: "100%",
      maxHeight: "60vh",
      overflowY: "auto",
      rowGap: "8px",

      marginBlockEnd: "0",
      marginBlockStart: "0",

      paddingInlineStart: "0",
    },
  ],
  variants: {
    active: {
      true: {
        marginBlockEnd: "8px",
        marginBlockStart: "8px",
      },
    },
  },
});

export const listItem = recipe({
  base: [
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
  ],
  variants: {
    active: {
      true: {
        backgroundColor: vars.$scale.color.gray50,
      },
    },
  },
});

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

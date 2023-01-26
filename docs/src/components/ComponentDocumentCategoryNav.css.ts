import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as u from "../styles/utils.css";

export const navContainer = style([
  u.flexAlignCenter,
  {
    marginTop: "20px",
    gap: "8px",
  },
]);

export const navLink = recipe({
  base: [
    u.flexAlignCenter,
    u.cursorPointer,
    {
      fontSize: "14px",
      fontWeight: "bold",

      padding: "4px 14px",
      borderRadius: "8px",

      transition: "background-color 0.2s ease",

      ":hover": {
        backgroundColor: vars.$scale.color.gray200,
      },
    },
  ],
  variants: {
    active: {
      true: {
        backgroundColor: vars.$scale.color.gray100,
      },
    },
  },
});

export const navLinkText = recipe({
  base: [
    {
      position: "relative",

      ":after": {
        content: "",
        display: "block",
        position: "absolute",
        right: "-8px",
        top: 0,
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        backgroundColor: vars.$scale.color.gray500,
      },
    },
  ],
  variants: {
    status: {
      todo: {
        ":after": {
          backgroundColor: vars.$scale.color.gray500,
        },
      },
      "in-progress": {
        ":after": {
          backgroundColor: vars.$scale.color.carrot500,
        },
      },
      done: {
        ":after": {
          backgroundColor: vars.$scale.color.green500,
        },
      },
    },
  },
});

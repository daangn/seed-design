import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as u from "../styles/utils.css";

export const container = style([u.flexCenter]);

export const toggler = recipe({
  base: [
    u.cursorPointer,
    u.flexCenter,
    {
      margin: "20px",
      padding: "4px",
      height: "34px",
      width: "34px",
      transition: "backgroundColor 0.3s ease",
      borderRadius: "50%",
    },
  ],
  variants: {
    isDarkMode: {
      true: {
        ":hover": {
          backgroundColor: vars.$scale.color.gray200,
        },
      },
      false: {
        ":hover": {
          backgroundColor: vars.$scale.color.gray200,
        },
      },
    },
  },
});

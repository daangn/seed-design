import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const titleDescription = style([t.documentCaption1]);

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

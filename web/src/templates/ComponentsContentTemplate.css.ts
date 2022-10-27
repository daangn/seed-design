import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as t from "../styles/token.css";

export const main = style([t.main]);

export const title = style([t.documentHeading1]);

export const titleDescription = style([t.documentCaption1]);

export const tabLink = recipe({
  base: {
    display: "flex",
    padding: "10px",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
  },
  variants: {
    active: {
      true: {
        backgroundColor: vars.$scale.color.gray200,
      },
    },
  },
});

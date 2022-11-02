import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";

export const nav = style([
  m.xlarge({
    display: "none",
  }),

  m.xxlarge({
    marginRight: "30px",
  }),

  {
    position: "sticky",
    top: "150px",

    width: "250px",

    borderLeft: "1px solid #eaeaea",
    marginRight: "250px",
  },
]);

export const list = style({
  listStyle: "none",

  paddingInlineStart: "20px",
});
export const title = style({
  fontSize: "18px",
  paddingInlineStart: "20px",
});

export const listItem = recipe({
  base: [
    {
      padding: "3px 0",
    },
  ],

  variants: {
    active: {
      true: {
        fontWeight: "bold",
      },
    },
  },
});

export const link = style({});

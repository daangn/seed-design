import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as m from "../styles/media.css";

export const nav = style([
  {
    display: "none",
    position: "sticky",
    top: "150px",
    width: "250px",
  },

  m.xlarge({
    display: "block",
  }),
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
      fontSize: "14px",
      color: vars.$scale.color.gray600,

      paddingTop: "3px",
      paddingBottom: "3px",
      paddingLeft: "10px",
      borderLeft: `1px solid ${vars.$scale.color.gray300}`,

      ":hover": {
        color: vars.$scale.color.gray900,
      },
    },
  ],

  variants: {
    active: {
      true: {
        color: vars.$scale.color.gray900,
        borderLeft: `1px solid ${vars.$scale.color.gray900}`,
        fontWeight: "bold",
      },
    },
  },
});

export const link = style({});

// @ts-nocheck

import { text } from "@seed-design/css/recipes/text";
import { style } from "@vanilla-extract/css";

const typography = {
  one: text({ textStyle: "t7Regular" }),
  two: text({ textStyle: "t4Regular" }),
  three: text({ textStyle: "t1Regular" }),
  four: text({ textStyle: "t1Regular" }),
}

export const footer = style([
  text({ textStyle: "t3Regular" }),
  {
    padding: "16px",
    marginTop: "12px",
    color: vars.$scale.color.gray700,
    backgroundColor: vars.$semantic.color.paperContents,
  },
]);

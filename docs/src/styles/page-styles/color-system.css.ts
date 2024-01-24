import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const heading2 = style([t.documentHeading2]);

export const paragraph = style([
  t.documentParagraph,
  {
    color: vars.$semantic.color.inkText,
    fontWeight: 500,
  },
]);

export const image = style({
  marginTop: "30px",
});

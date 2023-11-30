import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const heading2 = style([t.documentHeading2]);

export const heading3 = style([
  t.documentHeading3,
  {
    color: vars.$scale.color.gray700,
    marginTop: "40px",
  },
]);

export const paragraph = style([t.documentParagraph]);

export const image = style({
  marginTop: "30px",
});

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const logo = style([u.cursorPointer]);

export const logoCircle = style([
  {
    fill: vars.$scale.color.gray900,
  },
]);

export const logoText = style([
  {
    stroke: vars.$scale.color.gray900,
  },
]);

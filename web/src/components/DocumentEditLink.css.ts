import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const link = style([
  u.flexAlignCenter,
  u.cursorPointer,
  {
    gap: "10px",
    color: vars.$scale.color.gray600,
    transition: "color 0.25s",
    marginTop: "30px",

    ":hover": {
      color: vars.$scale.color.gray800,
    },
  },
]);

import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const logo = style([
  u.cursorPointer,
  {
    fontSize: "28px",
    fontWeight: 700,
    padding: "10px",
    margin: "8px",
    color: vars.$scale.color.gray00,
    borderRadius: "10px",
    transition: "background-color 0.3s ease",

    ":hover": {
      backgroundColor: vars.$scale.color.green700,
    },
  },
]);

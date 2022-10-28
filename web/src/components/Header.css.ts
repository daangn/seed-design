import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const header = style([
  u.flexAlignCenter,
  {
    position: "absolute",
    top: 0,
    left: 0,

    justifyContent: "space-between",
    width: "100%",
  },
]);

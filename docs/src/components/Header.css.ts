import { style } from "@vanilla-extract/css";

import * as u from "../styles/utils.css";

export const header = style([
  u.flexAlignCenter,
  u.middleLayer,
  {
    position: "fixed",
    top: 0,

    justifyContent: "right",
    width: "100%",
    maxWidth: "1400px",
    height: "60px",
    backdropFilter: "blur(5px)",
  },
]);

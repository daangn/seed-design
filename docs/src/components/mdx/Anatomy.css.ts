import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";
import * as u from "../../styles/utils.css";

export const image = style([
  u.topLayer,
  {
    display: "none",
  },
  m.large({
    display: "block",
    position: "fixed",
    width: "250px",
    bottom: 0,
    right: "30px",
  }),
]);

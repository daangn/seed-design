import { style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const titleDescription = style([t.documentCaption1]);

export const thumbnail = style([
  u.flexAlignCenter,
  {
    width: "100%",
    objectFit: "cover",
  },
]);

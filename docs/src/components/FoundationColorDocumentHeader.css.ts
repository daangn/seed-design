import { style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";

export const heading1 = style([t.documentHeading1]);

export const description = style([
  t.documentCaption1,
  {
    marginTop: "20px",
  },
]);

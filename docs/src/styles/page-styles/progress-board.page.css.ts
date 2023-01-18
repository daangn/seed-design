import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const title = style([t.documentHeading1]);

export const titleCaption = style([
  t.documentCaption1,
  {
    marginBottom: "2rem",
  },
]);

export const contentWrapper = style({
  marginBottom: "4rem",
});

export const percentage = style([
  {
    fontSize: "2rem",
    lineHeight: "160%",
  },
]);

import { globalStyle, style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const markdown = style({});

globalStyle(`${markdown} > *:first-child`, {
  marginTop: "60px",
});

export const titleDescription = style([t.documentCaption1]);

import { style } from "@vanilla-extract/css";

import * as m from "../media.css";
import * as t from "../token.css";

export const content = style([
  {
    maxWidth: "900px",
    minHeight: "calc(100vh)",
    width: "100%",
    margin: "80px auto",
    padding: "0px 20px",

    wordBreak: "keep-all",
    overflowWrap: "break-word",
    lineHeight: "1.7",
    letterSpacing: "-0.04px",
  },

  m.medium({
    padding: "0px",
    paddingLeft: "20px",
  }),

  m.large({
    margin: "130px 0px",
    maxWidth: "calc(100% - 400px)",
  }),
]);

export const title = style([t.documentHeading1]);

export const subTitle = style([t.documentHeading2]);

export const caption = style([
  t.documentCaption1,
  {
    paddingBottom: "70px",
  },
]);

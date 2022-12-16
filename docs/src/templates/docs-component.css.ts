import { style } from "@vanilla-extract/css";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const titleDescription = style([t.documentCaption1]);

export const navContainer = style([
  u.flexAlignCenter,
  {
    marginTop: "20px",
    gap: "8px",
  },
]);

export const navButton = style([
  u.flexAlignCenter,
  u.cursorPointer,
  {
    border: "none",

    padding: "12px",
  },
]);

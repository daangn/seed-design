import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../token.css";
import * as u from "../utils.css";

export const heading1 = style([t.documentHeading1]);

export const heading2 = style([t.documentHeading2]);

export const list = style([
  u.flexColumn,
  {
    paddingInlineStart: "0",
  },
]);

export const listItem = style([
  u.flex,
  {
    position: "relative",
    justifyContent: "space-between",
    width: "100%",
  },
]);

export const listItemText = style([
  {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    color: vars.$scale.color.gray00,
    fontSize: "20px",
    fontWeight: "600",
  },
]);

export const listItemBox = style([
  {
    width: "100%",
    height: "40px",
  },
]);

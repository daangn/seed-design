import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "./token.css";
import * as u from "./utils.css";

export const content = style([
  u.flexColumnCenter,
  {
    width: "100%",
    marginTop: "100px",
  },
]);

export const title = style([t.documentHeading1, {}]);

export const goDocsButton = style([
  u.flexCenter,
  u.cursorPointer,
  {
    backgroundColor: vars.$scale.color.gray900,
    color: vars.$scale.color.gray00,
    fontSize: "18px",
    fontWeight: "bold",
    padding: "20px 40px",
    border: "none",
    borderRadius: "28px",
    marginTop: "40px",
    columnGap: "10px",
  },
]);

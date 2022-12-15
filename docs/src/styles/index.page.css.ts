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

export const description = style([
  t.documentParagraph,
  { textAlign: "center", fontSize: "24px", marginTop: "20px" },
]);

export const goDocsButton = style([
  u.flexCenter,
  u.cursorPointer,
  {
    backgroundColor: vars.$semantic.color.paperDefault,
    color: vars.$scale.color.gray900,
    fontSize: "18px",
    fontWeight: "bold",
    padding: "20px 40px",

    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: vars.$scale.color.gray900,
    borderRadius: "50px",

    marginTop: "40px",
    columnGap: "10px",
  },
]);

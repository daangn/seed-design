import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "../token.css";

export const heading1 = style([t.documentHeading1]);

export const heading2 = style([t.documentHeading2]);

export const iconContainer = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  alignItems: "center",

  width: "100%",
});

export const iconBox = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "150px",
  height: "150px",
  margin: "20px 0",

  gap: "10px",
  borderRadius: "8px",
  backgroundColor: vars.$scale.color.grayAlpha50,

  transition: "all 0.15s ease",

  ":hover": {
    cursor: "pointer",
    backgroundColor: vars.$scale.color.grayAlpha100,
  },
});

export const iconName = style({
  fontSize: "12px",
  color: vars.$scale.color.gray900,
});

export const icon = style({});

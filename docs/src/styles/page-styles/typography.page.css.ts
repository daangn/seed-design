import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../media.css";
import * as t from "../token.css";
import * as u from "../utils.css";

export const heading1 = style([t.documentHeading1]);

export const heading1WithMargin = style([
  heading1,
  {
    marginTop: "120px",
  },
]);

export const heading2 = style([
  t.documentHeading2,
  {
    marginTop: "80px",
  },
]);

export const documentCaption1 = style([t.documentCaption1]);

export const typographyContainer = style([
  u.flex,
  {
    width: "100%",
    flexDirection: "column",
    alignItems: "start",
    marginTop: "40px",
    gap: "20px",
  },
  m.large({
    flexDirection: "row",
    alignItems: "end",
  }),
]);

export const descriptionContainer = style([
  u.flexAlignCenter,
  {
    width: "100%",
  },
]);

export const descriptionItem = style([
  {
    fontSize: "12px",
    color: vars.$scale.color.gray600,
  },
]);
export const descriptionItemName = style([
  descriptionItem,
  {
    width: "200px",
  },
]);

export const descriptionItemTitle = style([
  descriptionItem,
  {
    width: "100px",
  },
]);

export const descriptionItemValue = style([
  descriptionItem,
  {
    width: "50px",
  },
]);

export const textContainer = style([
  u.flexColumn,
  {
    width: "450px",
  },
]);

export const textLabel = style([
  {
    fontSize: "20px",
    fontWeight: "bold",
  },
]);

export const textArea = style([
  {
    width: "100%",
    border: "none",
    resize: "none",
    overflowX: "hidden",
    whiteSpace: "nowrap",

    ":focus": {
      outline: 0,
    },
  },
]);

export const scaleTokenContainer = style([
  u.flex,
  {
    marginTop: "20px",
    gap: "30px",
  },
]);

export const scaleTokenName = style([
  t.documentCaption1,
  {
    fontSize: "14px",
    width: "450px",
  },
]);

export const scaleTokenValue = style([
  t.documentCaption1,
  {
    fontSize: "14px",
    width: "100px",
  },
]);

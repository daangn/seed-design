import { classNames } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "./media.css";
import * as t from "./token.css";
import * as u from "./utils.css";

export const content = style([
  t.content,
  { margin: "130 20px" },
  m.large({
    margin: "130px 0px",
  }),
]);

export const title = style([t.documentHeading1, { marginTop: "0px" }]);

export const caption1 = style([
  t.documentCaption1,
  {
    marginTop: "10px",
  },
]);

export const grid = style([
  {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    marginTop: "40px",

    columnGap: "18px",
    rowGap: "38px",
  },

  m.xsmall({
    gridTemplateColumns: "repeat(2, 1fr)",
  }),

  m.small({
    gridTemplateColumns: "repeat(3, 1fr)",
  }),
]);

export const gridItem = style([
  u.flexColumn,
  {
    position: "relative",
    overflow: "hidden",

    transition: "scale 0.2s ease",

    gap: 8,
  },
]);

export const gridItemImage = style([
  {
    position: "relative",
    top: 0,
    left: 0,

    width: "100%",
    height: "auto",
    objectFit: "contain",
    overflow: "hidden",
    borderRadius: "8px",
  },
]);

export const gridItemTitle = style([
  classNames.$semantic.typography.title1Bold,
]);

export const gridItemDescription = style([
  classNames.$semantic.typography.caption1Regular,
]);

import { classNames } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../media.css";
import * as t from "../token.css";
import * as u from "../utils.css";

export const content = style([t.content]);

export const title = style([t.documentHeading1]);

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

  m.small({
    gridTemplateColumns: "repeat(2, 1fr)",
  }),

  m.medium({
    gridTemplateColumns: "repeat(3, 1fr)",
  }),
]);

export const gridItem = style([
  u.flexColumn,
  {
    position: "relative",
    overflow: "hidden",
    height: "100%",
    isolation: "isolate",

    zIndex: 0,

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

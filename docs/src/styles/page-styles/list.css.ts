import { classNames, vars } from "@seed-design/design-token";
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

    zIndex: 0,
  },
]);

export const activeGridItem = style([
  gridItem,
  {
    transition: "transform 0.2s ease",

    ":hover": {
      transform: "translateY(-4px)",
    },
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
    isolation: "isolate",
  },
]);

export const gridItemGroupText = style([
  classNames.$semantic.typography.caption1Bold,
  {
    color: vars.$scale.color.gray500,
    marginLeft: "8px",
  },
]);

export const gridNotReadyText = style({
  color: vars.$scale.color.gray500,
});

export const gridItemTitle = style([
  classNames.$semantic.typography.title1Bold,
  {
    marginTop: "8px",
  },
]);

export const gridItemDescription = style([
  classNames.$semantic.typography.caption1Regular,
  {
    marginTop: "6px",
  },
]);

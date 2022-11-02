import { classNames } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as t from "./token.css";
import * as u from "./utils.css";

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
    gridTemplateColumns: "repeat(3, 1fr)",
    marginTop: "40px",
    gridGap: "20px",
  },
]);

export const gridItem = style([
  u.flexColumnCenter,
  {
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",

    transition: "scale 0.2s ease",
  },
]);

export const gridItemImage = style([
  {
    position: "relative",
    top: 0,
    left: 0,

    width: "100%",
    height: "280px",
    objectFit: "contain",
  },
]);

export const gridItemTitle = style([
  classNames.$semantic.typography.h2,
  {
    position: "absolute",
  },
]);

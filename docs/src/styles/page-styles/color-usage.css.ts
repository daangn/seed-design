import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../media.css";
import * as t from "../token.css";

export const heading2 = style([
  t.documentHeading2,
  {
    fontSize: "26px",
    marginBottom: "10px",
  },
]);

export const heading3 = style([
  t.documentHeading3,
  {
    color: vars.$scale.color.gray700,
    marginTop: "40px",
  },
]);

export const paragraph1 = style([
  t.documentParagraph,
  {
    color: vars.$semantic.color.inkText,
    fontWeight: 500,
    marginTop: "0px",
  },
]);

export const paragraph2 = style([
  t.documentParagraph,
  {
    fontSize: "16px",
    color: vars.$semantic.color.inkText,
    fontWeight: 500,
  },
]);

export const image = style({
  marginTop: "30px",
});

export const halfCardContainer = style([
  {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",

    columnGap: "40px",
  },

  m.small({
    flexDirection: "row",
  }),
]);

export const halfCardTitle = style([
  heading2,
  {
    marginBottom: "10px",
  },
]);

export const halfCardDescription = style([
  paragraph2,
  {
    marginTop: "0px",
  },
]);

export const halfCardLeft = style({
  flex: 1,
});

export const halfCardRight = style({
  flex: 1,
});

export const halfCardList = style([
  {
    marginTop: "16px",
    paddingInlineStart: "0px",

    listStyle: "inside",

    display: "flex",
    flexDirection: "column",
  },
]);

export const halfCardListItemTitle = style([
  {
    fontWeight: 700,
  },
]);

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

export const doDontContainer = style([
  {
    display: "flex",
    flexDirection: "column",

    gap: "40px",

    marginTop: "30px",
  },

  m.small({
    flexDirection: "row",
  }),
]);

const doDontBadge = style([
  {
    padding: "4px 8px",

    borderRadius: "4px",

    fontWeight: 700,
  },
]);

export const doDontImage = style([
  image,
  {
    marginTop: "10px",
  },
]);

export const dontBadge = style([
  doDontBadge,
  {
    backgroundColor: vars.$semantic.color.danger,

    color: vars.$static.color.staticWhite,
  },
]);

export const doBadge = style([
  doDontBadge,
  {
    backgroundColor: vars.$semantic.color.success,

    color: vars.$static.color.staticWhite,
  },
]);

export const doDontItem = style([
  {
    flex: 1,

    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
  },
]);

export const doDontDescription = style([
  {
    fontSize: "14px",
    fontWeight: 500,
    color: vars.$scale.color.gray700,

    marginTop: "10px",
  },
]);

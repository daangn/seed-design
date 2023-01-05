import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "./media.css";
import * as t from "./token.css";
import * as u from "./utils.css";

export const content = style([
  u.flexColumnCenter,
  {
    width: "100%",
    marginTop: "100px",
    marginBottom: "200px",
  },
]);

export const title = style([
  t.documentHeading1,
  {
    fontSize: "42px",
    fontWeight: "900",
    marginTop: "80px",
  },
  m.small({
    fontSize: "64px",
  }),
]);

export const description = style([
  t.documentParagraph,
  {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",

    marginTop: "20px",
  },
  m.small({
    fontSize: "24px",
  }),
]);

export const goDocsButton = style([
  u.flexCenter,
  u.cursorPointer,
  {
    boxSizing: "border-box",

    backgroundColor: vars.$semantic.color.paperDefault,
    color: vars.$scale.color.gray900,

    fontSize: "16px",
    fontWeight: "bold",

    border: `2px solid ${vars.$scale.color.gray900}`,
    borderRadius: "50px",

    padding: "14px 22px",
    marginTop: "40px",
    columnGap: "10px",
  },

  m.small({
    fontSize: "18px",
  }),
]);

export const cardList = style([
  u.flexColumnCenter,
  {
    width: "80%",
    marginTop: "60px",

    gap: "20px",
  },

  m.medium({
    flexDirection: "row",
  }),
]);

export const cardContainer = style([
  u.flexColumn,
  {
    width: "320px",
    height: "230px",

    justifyContent: "space-between",

    backgroundColor: vars.$scale.color.blue50,

    padding: "20px",

    borderRadius: "20px",
  },

  m.small({
    width: "435px",
    height: "290px",

    padding: "40px",
  }),
]);

export const cardNumber = style([
  u.flexCenter,
  {
    color: vars.$scale.color.gray800,
    fontWeight: "600",
    fontSize: "14px",

    borderRadius: "50%",

    width: "30px",
    height: "30px",
  },

  m.small({
    fontSize: "16px",

    width: "42px",
    height: "42px",
  }),
]);

export const cardContent = style([
  u.flexColumn,
  {
    gap: "18px",
  },
]);

export const cardTitle = style([
  {
    fontSize: "24px",
    fontWeight: "900",
  },

  m.small({
    fontSize: "34px",
  }),
]);

export const cardDescription = style([
  {
    fontSize: "16px",
    fontWeight: "600",
  },

  m.small({
    fontSize: "20px",
  }),
]);

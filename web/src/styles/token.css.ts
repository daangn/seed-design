import { classNames, vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "./media.css";

export const main = style([
  { position: "relative", width: "100%", display: "flex" },
]);

export const content = style([
  {
    maxWidth: "900px",
    width: "100%",
    margin: "50px auto",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    lineHeight: "1.7",
    letterSpacing: "-0.04px",
  },

  m.large({
    padding: "0px 30px",
  }),

  m.small({
    padding: "0px 20px",
  }),
]);

export const documentHeading1 = style([
  classNames.$semantic.typography.h1,
  {
    fontSize: "66px",
    fontWeight: 700,
    marginTop: "85px",
  },
  m.small({
    fontSize: "50px",
    marginTop: "60px",
  }),
]);

export const documentHeading2 = style([
  classNames.$semantic.typography.h2,
  {
    fontWeight: 700,
    marginTop: "120px",
  },
  m.small({
    fontSize: "36px",
    marginTop: "60px",
  }),
]);

export const documentHeading3 = style([
  classNames.$semantic.typography.h3,
  {
    fontWeight: 700,
    fontSize: "28px",
    marginTop: "40px",
  },
]);

export const documentHeading4 = style([
  classNames.$semantic.typography.h4,
  {
    fontWeight: 700,
    marginTop: "35px",
  },
  m.small({
    fontSize: "24px",
    marginTop: "20px",
  }),
]);

export const documentParagraph = style([
  classNames.$semantic.typography.bodyL1Regular,
  {
    marginTop: "10px",
  },

  m.small({
    fontSize: "16px",
  }),
]);

export const documentCaption1 = style([
  classNames.$semantic.typography.title2Bold,
  {
    color: vars.$scale.color.gray600,
  },
  m.small({
    fontSize: "18px",
  }),
]);

export const documentCaption2 = style([
  classNames.$semantic.typography.bodyL1Regular,
  {
    color: vars.$scale.color.gray600,
  },
  m.small({
    fontSize: "16px",
  }),
]);

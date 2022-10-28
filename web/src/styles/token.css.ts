import { classNames, vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "./media.css";

export const main = style([
  {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "10px",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    lineHeight: "1.7",
    letterSpacing: "-0.04px",
  },
  m.small({}),
]);

export const documentHeading1 = style([
  classNames.$semantic.typography.h1,
  {
    fontSize: "66px",
    fontWeight: 700,
    marginTop: "85px",
    marginBottom: "10px",
  },
]);

export const documentHeading2 = style([
  classNames.$semantic.typography.h2,
  {
    fontWeight: 700,
    marginTop: "75px",
    marginBottom: "20px",
  },
]);

export const documentHeading3 = style([
  classNames.$semantic.typography.h3,
  {
    fontWeight: 700,
    marginTop: "40px",
    marginBottom: "20px",
  },
]);

export const documentHeading4 = style([
  classNames.$semantic.typography.h4,
  {
    fontWeight: 700,
    marginTop: "35px",
    marginBottom: "20px",
  },
]);

export const documentCaption1 = style([
  classNames.$semantic.typography.title2Bold,
  {
    color: vars.$scale.color.gray600,
  },
]);

export const documentCaption2 = style([
  classNames.$semantic.typography.bodyL1Regular,
  {
    color: vars.$scale.color.gray600,
  },
]);

// @ts-nocheck

import { classNames } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

const typography = {
  one: classNames.$semantic.typography.title2Regular,
  two: classNames.$semantic.typography.label3Regular,
  three: classNames.$semantic.typography.label5Regular,
  four: classNames.$semantic.typography.label6Regular,
}

export const footer = style([
  classNames.$semantic.typography.caption1Regular,
  {
    padding: "16px",
    marginTop: "12px",
    color: vars.$scale.color.gray700,
    backgroundColor: vars.$semantic.color.paperContents,
  },
]);

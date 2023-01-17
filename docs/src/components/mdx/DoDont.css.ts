import { classNames, vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../../styles/media.css";
import * as u from "../../styles/utils.css";

const card = style([
  {
    position: "relative",

    width: "100%",

    borderRadius: "8px",
    border: `1px solid ${vars.$scale.color.gray300}`,
    backgroundColor: vars.$semantic.color.onPrimary,
    overflow: "hidden",
  },
]);
export const doCard = style([
  card,
  {
    borderBottom: `5px solid ${vars.$semantic.color.success}`,
  },
]);
export const dontCard = style([
  card,
  {
    borderBottom: `5px solid ${vars.$semantic.color.danger}`,
  },
]);

const icon = style([
  u.flexCenter,
  {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "12px",

    width: "38px",
    height: "38px",
    borderRadius: "50%",
  },
]);
export const doIcon = style([
  icon,
  {
    backgroundColor: vars.$scale.color.greenAlpha100,
    color: vars.$semantic.color.success,
  },
]);
export const dontIcon = style([
  icon,
  {
    backgroundColor: vars.$scale.color.redAlpha100,
    color: vars.$semantic.color.danger,
  },
]);

const titleText = style([
  classNames.$semantic.typography.title2Bold,
  {
    fontSize: "20px",
  },
]);
export const doTitleText = style([
  titleText,
  {
    color: vars.$semantic.color.success,
  },
]);
export const dontTitleText = style([
  titleText,
  {
    color: vars.$semantic.color.danger,
  },
]);

export const doDontLayout = style([
  u.flexColumnCenter,
  {
    padding: "20px",
    paddingBottom: "40px",
    color: vars.$static.color.staticBlack,
    gap: "20px",
  },

  m.medium({
    flexDirection: "row",
  }),
]);

export const box = style([
  u.flexColumn,
  {
    width: "100%",
  },
]);

export const description = style([
  classNames.$semantic.typography.bodyL1Regular,
  {
    fontSize: "16px",
  },
]);

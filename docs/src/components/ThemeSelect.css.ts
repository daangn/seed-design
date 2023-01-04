import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

import * as m from "../styles/media.css";
import * as u from "../styles/utils.css";

export const selectContainer = style([
  {
    position: "relative",
  },
]);

export const select = style([
  u.flexCenter,
  u.cursorPointer,
  {
    fontSize: "14px",

    width: "36px",
    height: "36px",

    borderRadius: "6px",
    border: "none",
    backgroundColor: vars.$semantic.color.paperDefault,

    color: vars.$scale.color.gray800,
  },

  m.small({
    justifyContent: "space-between",
    fontSize: "14px",

    width: "106px",
    height: "36px",

    borderRadius: "6px",
    border: `1px solid ${vars.$scale.color.gray300}`,
    backgroundColor: vars.$semantic.color.paperDefault,

    color: vars.$scale.color.gray800,

    padding: "10px",

    transition: "border 0.2s ease",

    ":hover": {
      border: `1px solid ${vars.$scale.color.gray600}`,
    },
  }),
]);

export const selectLeftSection = style([
  u.flex,
  {
    gap: "4px",
  },
]);

export const optionList = style([
  u.flexColumnCenter,
  {
    position: "absolute",
    top: "28px",
    right: 0,

    width: "90px",

    backgroundColor: vars.$scale.color.gray00,

    borderRadius: "6px",
    border: `1px solid ${vars.$scale.color.gray300}`,

    paddingInlineStart: 0,
    padding: "6px 0px",

    gap: "6px",
  },

  m.small({
    width: "100%",
  }),
]);

export const option = style([
  u.flexAlignCenter,
  u.cursorPointer,
  {
    width: "90%",
    height: "28px",

    fontSize: "14px",

    borderRadius: "4px",

    padding: "4px",

    gap: "4px",

    ":hover": {
      backgroundColor: vars.$scale.color.gray50,
    },
  },
]);

export const icon = style([
  {
    display: "none",
  },
  m.small({
    display: "block",
  }),
]);

export const label = style([
  {
    display: "none",
  },
  m.small({
    display: "block",
  }),
]);

import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/design-token";

import { f } from "@/styles";

export const wrapper = style([f.posAbsFull, f.flexColumn, f.rootLineHeight]);

export const appBarLeft = style([
  f.flex,
  {
    fontSize: "1.125rem",
    fontWeight: 700,
    marginLeft: ".5rem",
  },
]);

export const appBarLeftIcon = style([
  f.flexAlignCenter,
  {
    marginLeft: ".5rem",
  },
]);

export const appBarRight = style([
  {
    display: "grid",
    gridTemplateColumns: "1.5rem 1.5rem 1.5rem",
    gap: "1rem",
    marginRight: ".5rem",
  },
]);

export const content = style({
  flex: 1,
});

// BottomTab

export const container = style([
  f.grid,
  {
    backgroundColor: vars.$semantic.color.paperDefault,
    gridTemplateColumns: "1.5rem 1.5rem 1.5rem 1.5rem 1.5rem",
    justifyContent: "space-between",
    padding: ".5rem 7.25% 0",
    paddingBottom: ".375rem",
    "@supports": {
      "(padding-bottom: constant(safe-area-inset-bottom))": {
        paddingBottom: "calc(.375rem + constant(safe-area-inset-bottom))",
      },
      "(padding-bottom: env(safe-area-inset-bottom))": {
        paddingBottom: "calc(.375rem + env(safe-area-inset-bottom))",
      },
    },
    boxShadow: `0 -1px 0 0 ${vars.$semantic.color.divider2}`,
  },
]);

export const button = style([f.flexColumn, f.flexAlignCenter, f.resetButton, f.cursorPointer]);

export const buttonIcon = style([
  {
    marginBottom: ".375rem",
  },
]);

export const buttonLabel = style([
  f.nowrap,
  {
    fontSize: ".75rem",
  },
]);

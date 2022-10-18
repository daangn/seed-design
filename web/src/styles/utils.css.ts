import { style } from "@vanilla-extract/css";

export const flex = style({
  display: "flex",
});

export const flexColumn = style([
  flex,
  {
    flexDirection: "column",
  },
]);

export const flexAlignCenter = style([
  flex,
  {
    alignItems: "center",
  },
]);

export const flexJustifyCenter = style([
  flex,
  {
    justifyContent: "center",
  },
]);

export const flexCenter = style([flex, flexAlignCenter, flexJustifyCenter]);

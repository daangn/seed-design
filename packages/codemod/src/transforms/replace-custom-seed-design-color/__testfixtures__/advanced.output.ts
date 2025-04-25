import { vars } from "@seed-design/css/vars";
// @ts-nocheck
import { style, styleVariants } from "@vanilla-extract/css";

export const buttonVariants = styleVariants({
  primary: {
    backgroundColor: vars.$color.palette.carrot600,
    color: vars.$color.palette.gray00,
    borderColor: vars.$color.palette.carrot600,
  },
  secondary: {
    backgroundColor: vars.$color.palette.gray300,
    color: vars.$color.palette.gray1000,
    borderColor: vars.$color.palette.gray400,
  },
  danger: {
    backgroundColor: vars.$color.palette.red700,
    color: vars.$color.palette.gray00,
    outline: `1px solid ${vars.$color.palette.red700}`,
  },
});

export const iconButton = style({
  fill: vars.$color.palette.gray1000,
  stroke: vars.$color.palette.gray900,
  backgroundColor: vars.$color.palette.gray100,
});

export const specialItem = style({
  color: vars.$color.palette.gray500,
  border: `1px solid ${vars.$color.palette.gray300}`,
}); 
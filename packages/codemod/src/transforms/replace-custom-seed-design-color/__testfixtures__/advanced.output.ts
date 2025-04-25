// @ts-nocheck
import { style, styleVariants } from "@vanilla-extract/css";
import { color, background } from "@/shared/styles";

export const buttonVariants = styleVariants({
  primary: {
    backgroundColor: color.palette.carrot600,
    color: color.palette.gray00,
    borderColor: color.palette.carrot600,
  },
  secondary: {
    backgroundColor: color.palette.gray300,
    color: color.palette.gray1000,
    borderColor: color.palette.gray400,
  },
  danger: {
    backgroundColor: color.palette.red700,
    color: color.palette.gray00,
    outline: `1px solid ${color.palette.red700}`,
  },
});

export const iconButton = style({
  fill: color.palette.gray1000,
  stroke: color.palette.gray900,
  backgroundColor: background.palette.gray100,
});

export const specialItem = style({
  color: color.palette.gray500,
  border: `1px solid ${color.palette.gray300}`,
}); 
// @ts-nocheck
import { style, styleVariants } from "@vanilla-extract/css";
import { color, background } from "@/shared/styles";

export const buttonVariants = styleVariants({
  primary: {
    backgroundColor: color.carrot500,
    color: color.gray00,
    borderColor: color.carrot600,
  },
  secondary: {
    backgroundColor: color.gray200,
    color: color.gray900,
    borderColor: color.gray300,
  },
  danger: {
    backgroundColor: color.red500,
    color: color.gray00,
    outline: `1px solid ${color.red600}`,
  },
});

export const iconButton = style({
  fill: color.gray900,
  stroke: color.gray800,
  backgroundColor: background.gray50,
});

export const specialItem = style({
  color: color.grayAlpha200,
  border: `1px solid ${color.grayAlpha100}`,
}); 
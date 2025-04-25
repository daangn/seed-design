// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { color, background } from "@/shared/styles";

export const container = style({
  backgroundColor: color.gray100,
  color: color.gray900,
  borderColor: color.carrot500,
});

export const box = style({
  background: color.gray50,
  color: color.red500,
  border: `1px solid ${color.gray300}`,
});

export const alert = style({
  backgroundColor: color.red50,
  color: color.red900,
});

export const button = style({
  backgroundColor: background.gray100,
  color: color.gray900,
});

export const highlight = style({
  color: color.carrot500,
}); 
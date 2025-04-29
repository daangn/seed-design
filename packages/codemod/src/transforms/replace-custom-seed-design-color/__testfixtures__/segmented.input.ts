// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { color } from "@/shared/styles";

export const container = style({
  backgroundColor: color.scale.gray100,
  color: color.scale.gray900,
  borderColor: color.scale.carrot500,
});

export const box = style({
  background: color.static.white,
  color: color.static.black,
  border: `1px solid ${color.scale.gray300}`,
});

export const alert = style({
  backgroundColor: color.semantic.dangerLow,
  color: color.semantic.danger,
});

export const button = style({
  backgroundColor: color.semantic.secondaryLow,
  color: color.semantic.secondary,
});

export const highlight = style({
  color: color.semantic.primary,
  backgroundColor: color.semantic.primaryLow,
}); 

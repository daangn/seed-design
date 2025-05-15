// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { f } from "@/shared/styles";

export const container = style({
  backgroundColor: f.color.scale.gray100,
  color: f.color.scale.gray900,
  borderColor: f.color.scale.carrot500,
});

export const box = style({
  background: f.color.static.white,
  color: f.color.static.black,
  border: `1px solid ${f.color.scale.gray300}`,
});

export const alert = style({
  backgroundColor: f.color.semantic.dangerLow,
  color: f.color.semantic.danger,
});

export const button = style({
  backgroundColor: f.color.semantic.secondaryLow,
  color: f.color.semantic.secondary,
});

export const highlight = style({
  color: f.color.semantic.primary,
  backgroundColor: f.color.semantic.primaryLow,
}); 

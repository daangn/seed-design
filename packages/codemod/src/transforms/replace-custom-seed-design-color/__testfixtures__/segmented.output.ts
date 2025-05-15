// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { f } from "@/shared/styles";

export const container = style({
  backgroundColor: f.color.palette.gray200,
  color: f.color.palette.gray1000,
  borderColor: f.color.palette.carrot600,
});

export const box = style({
  background: f.color.palette.staticWhite,
  color: f.color.palette.staticBlack,
  border: `1px solid ${f.color.palette.gray400}`,
});

export const alert = style({
  backgroundColor: f.color.bg.criticalWeak,
  color: f.color.fg.critical,
});

export const button = style({
  backgroundColor: f.color.bg.neutralWeak,
  color: f.color.palette.gray900,
});

export const highlight = style({
  color: f.color.fg.brand,
  backgroundColor: f.color.palette.carrot100,
}); 

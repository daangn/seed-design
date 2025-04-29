// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { color } from "@/shared/styles";

export const container = style({
  backgroundColor: color.palette.gray200,
  color: color.palette.gray1000,
  borderColor: color.palette.carrot600,
});

export const box = style({
  background: color.palette.staticWhite,
  color: color.palette.staticBlack,
  border: `1px solid ${color.palette.gray400}`,
});

export const alert = style({
  backgroundColor: color.bg.criticalWeak,
  color: color.fg.critical,
});

export const button = style({
  backgroundColor: color.bg.neutralWeak,
  color: color.palette.gray900,
});

export const highlight = style({
  color: color.fg.brand,
  backgroundColor: color.palette.carrot100,
}); 

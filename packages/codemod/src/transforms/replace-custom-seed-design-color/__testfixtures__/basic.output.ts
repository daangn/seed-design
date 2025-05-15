// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { color, backgroundColor, background } from "@/shared/styles";

export const container = style({
  backgroundColor: color.palette.gray200,
  color: color.palette.gray1000,
  borderColor: color.palette.carrot600,
});

export const box = style({
  background: color.palette.gray100,
  color: color.palette.red700,
  border: `1px solid ${color.palette.gray400}`,
});

export const alert = style({
  backgroundColor: color.palette.red100,
  color: color.palette.red900,
});

export const button = style({
  backgroundColor: background.palette.gray200,
  color: color.palette.gray1000,
});

export const highlight = style({
  color: color.palette.carrot600,
  backgroundColor: backgroundColor.bg.brandSolid,
}); 

export const primary = style({
  color: color.fg.brand,
});
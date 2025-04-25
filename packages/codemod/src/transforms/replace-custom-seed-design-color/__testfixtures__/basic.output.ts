import { vars } from "@seed-design/css/vars";
// @ts-nocheck
import { style } from "@vanilla-extract/css";

export const container = style({
  backgroundColor: vars.$color.palette.gray200,
  color: vars.$color.palette.gray1000,
  borderColor: vars.$color.palette.carrot600,
});

export const box = style({
  background: vars.$color.palette.gray100,
  color: vars.$color.palette.red700,
  border: `1px solid ${vars.$color.palette.gray400}`,
});

export const alert = style({
  backgroundColor: vars.$color.palette.red100,
  color: vars.$color.palette.red900,
});

export const button = style({
  backgroundColor: vars.$color.palette.gray200,
  color: vars.$color.palette.gray1000,
});

export const highlight = style({
  color: vars.$color.palette.carrot600,
}); 
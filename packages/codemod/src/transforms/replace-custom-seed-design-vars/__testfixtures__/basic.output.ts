// @ts-nocheck
import { vars } from '@/shared/style/vars';

export const date = style({
  ...vars.typography.t3Regular,
  color: vars.color.palette.gray700,
});

export const color1 = style({
  color: vars.color.palette.yellow700,
});

export const color2 = style({
  color: vars.color.palette.blue600,
});

export const color3 = style({
  color: vars.color.palette.red700,
});

export const title = style({
  ...vars.typography.t5Bold,
  color: vars.color.fg.brand,
});

export const subtitle = style({
  ...vars.typography.t4Regular,
  color: vars.color.palette.gray900,
});

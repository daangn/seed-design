// @ts-nocheck
import { vars } from '@/shared/style/vars';

export const date = style({
  ...vars.typography.caption1Regular,
  color: vars.color.gray600,
});

export const color1 = style({
  color: vars.color.yellow500,
});

export const color2 = style({
  color: vars.color.blue500,
});

export const color3 = style({
  color: vars.color.red500,
});

export const title = style({
  ...vars.typography.bodyM1Bold,
  color: vars.color.primary,
});

export const subtitle = style({
  ...vars.typography.bodyM2Regular,
  color: vars.color.secondary,
});

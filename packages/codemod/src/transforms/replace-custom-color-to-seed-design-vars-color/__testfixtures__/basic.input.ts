// @ts-nocheck
import { color, bg, typography, mode } from '@/src/styles/tokens';

export const container = style({
  backgroundColor: color['$semantic.paperDefault'],
  color: color['$scale.gray900'],
  borderColor: color['$scale.carrot500'],
});

export const box = style({
  background: color['$scale.gray50'],
  color: color['$scale.red500'],
  border: `1px solid ${color['$scale.gray300']}`,
});

export const alert = style({
  backgroundColor: color['$scale.red50'],
  color: color['$scale.red900'],
});

export const button = style({
  backgroundColor: color['$scale.gray100'],
  color: color['$scale.gray900'],
});

export const highlight = style({
  color: color['$scale.carrot500'],
  backgroundColor: color['$semantic.primary'],
});

export const primary = style({
  color: color['$semantic.primary'],
});

// Additional test cases for various mappings
export const semanticColors = style({
  backgroundColor: color['$semantic.primary'],
  color: color['$semantic.inkText'],
  borderColor: color['$semantic.divider1'],
});

export const scaleColors = style({
  background: color['$scale.gray100'],
  color: color['$scale.carrot600'],
  border: `1px solid ${color['$scale.blue500']}`,
});

export const staticColors = style({
  backgroundColor: color['$static.staticWhite'],
  color: color['$static.staticBlack'],
  borderColor: color['$static.staticBlackAlpha200'],
});

// Test deprecated tokens with alternative
export const deprecatedColors = style({
  backgroundColor: color['$semantic.paperContents'],
  color: color['$semantic.inkTextLow'],
});

// Test multiple token choices (should use first one)
export const multipleChoices = style({
  backgroundColor: color['$semantic.success'],
  color: color['$semantic.warning'],
});

export const icon = {
  color: color['$scale.gray600'],
  bg: bg['$scale.gray100'],
};

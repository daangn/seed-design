// @ts-nocheck
import { color, bg, typography, mode } from '@/src/styles/tokens';

export const container = style({
  backgroundColor: color["bg.layerDefault"],
  color: color["palette.gray1000"],
  borderColor: color["palette.carrot600"],
});

export const box = style({
  background: color["palette.gray100"],
  color: color["palette.red700"],
  border: `1px solid ${color["palette.gray400"]}`,
});

export const alert = style({
  backgroundColor: color["palette.red100"],
  color: color["palette.red900"],
});

export const button = style({
  backgroundColor: color["palette.gray200"],
  color: color["palette.gray1000"],
});

export const highlight = style({
  color: color["palette.carrot600"],
  backgroundColor: color["bg.brandSolid"],
});

export const primary = style({
  color: color["fg.brand"],
});

// Additional test cases for various mappings
export const semanticColors = style({
  backgroundColor: color["bg.brandSolid"],
  color: color["fg.neutral"],
  borderColor: color["stroke.neutralMuted"],
});

export const scaleColors = style({
  background: color["palette.gray200"],
  color: color["palette.carrot600"],
  border: `1px solid ${color["palette.blue600"]}`,
});

export const staticColors = style({
  backgroundColor: color["palette.staticWhite"],
  color: color["palette.staticBlack"],
  borderColor: color["palette.staticBlackAlpha500"],
});

// Test deprecated tokens with alternative
export const deprecatedColors = style({
  backgroundColor: color["bg.layerFill"],
  color: color["fg.neutralSubtle"],
});

// Test multiple token choices (should use first one)
export const multipleChoices = style({
  backgroundColor: color["bg.positiveSolid"],
  color: color["bg.warningSolid"],
});

export const icon = {
  color: color["palette.gray700"],
  bg: bg["palette.gray200"],
};

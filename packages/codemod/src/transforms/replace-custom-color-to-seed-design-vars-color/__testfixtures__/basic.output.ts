// @ts-nocheck
import { typography, mode } from '@/src/styles/tokens';

import { vars } from "@seed-design/css/vars";

export const container = style({
  backgroundColor: vars.$color.bg.layerDefault,
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
  backgroundColor: vars.$color.bg.brandSolid,
});

export const primary = style({
  color: vars.$color.fg.brand,
});

// Additional test cases for various mappings
export const semanticColors = style({
  backgroundColor: vars.$color.bg.brandSolid,
  color: vars.$color.fg.neutral,
  borderColor: vars.$color.stroke.neutralMuted,
});

export const scaleColors = style({
  background: vars.$color.palette.gray200,
  color: vars.$color.palette.carrot600,
  border: `1px solid ${vars.$color.palette.blue600}`,
});

export const staticColors = style({
  backgroundColor: vars.$color.palette.staticWhite,
  color: vars.$color.palette.staticBlack,
  borderColor: vars.$color.palette.staticBlackAlpha200,
});

// Test deprecated tokens with alternative
export const deprecatedColors = style({
  backgroundColor: vars.$color.bg.layerFill,
  color: vars.$color.fg.neutralSubtle,
});

// Test multiple token choices (should use first one)
export const multipleChoices = style({
  backgroundColor: vars.$color.bg.positiveSolid,
  color: vars.$color.bg.warningSolid,
});

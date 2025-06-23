// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/css";
import { f, reset } from "@/shared/styles";
import { typography } from '@/src/styles/tokens';

export const title = style([
  typography.h4,
  {
    textAlign: "center",
    color: vars.$scale.color.gray900,
    margin: 0,
  },
]);

export const subtitle = style([
  f.typography.title2Bold,
  {
    marginBottom: "0.375rem",
    color: vars.$scale.color.gray900,
  },
]);

export const smallText = style([
  typo.caption2Regular,
  {
    color: vars.$scale.color.gray700,
  },
]);

export const largeTitle = style([
  typo.bodyL1Regular,
  {
    color: vars.$scale.color.gray900,
  },
]);

export const button = style([
  typography['$semantic.label2Regular'],
  {
    width: '100%',
    paddingTop: rem(14),
    paddingRight: rem(16),
    paddingBottom: rem(14),
    paddingLeft: rem(16),
  },
]);

export const day = style([
  {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: rem(30),
  },
  typography['$semantic.caption1Regular'],
]);

// Additional test cases for various mappings
export const titleBold = style([
  typography.title3Bold,
  {
    fontWeight: 'bold',
  },
]);

export const subtitleRegular = style([
  f.typography.subtitle2Regular,
  {
    color: vars.$scale.color.gray800,
  },
]);

export const bodyText = style([
  typo.bodyM1Regular,
  {
    lineHeight: 1.5,
  },
]);

export const labelText = style([
  typography['$semantic.label1Bold'],
  {
    textTransform: 'uppercase',
  },
]);

export const captionBold = style([
  typography['$semantic.caption2Bold'],
  {
    fontSize: '12px',
  },
]);

// Test deprecated tokens with alternative
export const deprecatedBody = style([
  typo.bodyL2Regular,
  {
    margin: '8px 0',
  },
]);

export const deprecatedLabel = style([
  typography['$semantic.label6Regular'],
  {
    opacity: 0.8,
  },
]);

// Test multiple token choices (should use first one)
export const headerText = style([
  typography.h4,
  {
    textAlign: 'center',
  },
]);

export const text = style([
  text['$semantic.bodyL2Bold'],
]);

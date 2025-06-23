// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/css";
import { f, reset } from "@/shared/styles";
import { typography } from '@/src/styles/tokens';

export const title = style([
  typography.t10Bold,
  {
    textAlign: "center",
    color: vars.$scale.color.gray900,
    margin: 0,
  },
]);

export const subtitle = style([
  f.typography.t7Bold,
  {
    marginBottom: "0.375rem",
    color: vars.$scale.color.gray900,
  },
]);

export const smallText = style([
  typo.t2Regular,
  {
    color: vars.$scale.color.gray700,
  },
]);

export const largeTitle = style([
  typo.articleBody,
  {
    color: vars.$scale.color.gray900,
  },
]);

export const button = style([
  typography.t5Regular,
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
  typography.t3Regular,
]);

// Additional test cases for various mappings
export const titleBold = style([
  typography.t6Bold,
  {
    fontWeight: 'bold',
  },
]);

export const subtitleRegular = style([
  f.typography.t4Regular,
  {
    color: vars.$scale.color.gray800,
  },
]);

export const bodyText = style([
  typo.t5Regular,
  {
    lineHeight: 1.5,
  },
]);

export const labelText = style([
  typography.t6Bold,
  {
    textTransform: 'uppercase',
  },
]);

export const captionBold = style([
  typography.t2Bold,
  {
    fontSize: '12px',
  },
]);

// Test deprecated tokens with alternative
export const deprecatedBody = style([
  typo.t4Regular,
  {
    margin: '8px 0',
  },
]);

export const deprecatedLabel = style([
  typography.t1Regular,
  {
    opacity: 0.8,
  },
]);

// Test multiple token choices (should use first one)
export const headerText = style([
  typography.t10Bold,
  {
    textAlign: 'center',
  },
]);

export const text = style([
  typography.t4Bold,
]);

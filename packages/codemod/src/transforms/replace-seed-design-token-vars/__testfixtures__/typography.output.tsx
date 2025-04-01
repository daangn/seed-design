import { vars as legacyVars } from "@seed-design/design-token";

import { vars as typoVars } from "@seed-design/css/vars/component/typography";

// Basic typography
const basicTypography = {
  h1: legacyVars.$semantic.typography.h1,
  h2: legacyVars.$semantic.typography.h2,
  h3: legacyVars.$semantic.typography.h3,
  h4: typoVars.textStyleT10Bold.enabled.root,
  title1Bold: typoVars.textStyleT9Bold.enabled.root,
  title1Regular: legacyVars.$semantic.typography.title1Regular,
  title2Bold: typoVars.textStyleT7Bold.enabled.root,
  title2Regular: typoVars.textStyleT7Regular.enabled.root,
  title3Bold: typoVars.textStyleT6Bold.enabled.root,
  title3Regular: typoVars.textStyleT6Regular.enabled.root,
  subtitle1Bold: typoVars.textStyleT5Bold.enabled.root,
  subtitle1Regular: typoVars.textStyleT5Regular.enabled.root,
  subtitle2Bold: typoVars.textStyleT4Bold.enabled.root,
  subtitle2Regular: typoVars.textStyleT4Regular.enabled.root,
};

// Body typography
const bodyTypography = {
  bodyL1Bold: typoVars.textStyleT5Bold.enabled.root,
  bodyL1Regular: typoVars.textStyleArticleBody.enabled.root,
  bodyL2Bold: typoVars.textStyleT4Bold.enabled.root,
  bodyL2Regular: typoVars.textStyleT4Regular.enabled.root,
  bodyM1Bold: typoVars.textStyleT5Bold.enabled.root,
  bodyM1Regular: typoVars.textStyleT5Regular.enabled.root,
  bodyM2Bold: typoVars.textStyleT4Bold.enabled.root,
  bodyM2Regular: typoVars.textStyleT4Regular.enabled.root,
};

// Caption typography
const captionTypography = {
  caption1Bold: typoVars.textStyleT3Bold.enabled.root,
  caption1Regular: typoVars.textStyleT3Regular.enabled.root,
  caption2Bold: typoVars.textStyleT2Bold.enabled.root,
  caption2Regular: typoVars.textStyleT2Regular.enabled.root,
};

// Label typography
const labelTypography = {
  label1Bold: typoVars.textStyleT6Bold.enabled.root,
  label1Regular: typoVars.textStyleT6Regular.enabled.root,
  label2Bold: typoVars.textStyleT5Bold.enabled.root,
  label2Regular: typoVars.textStyleT5Regular.enabled.root,
  label3Bold: typoVars.textStyleT4Bold.enabled.root,
  label3Regular: typoVars.textStyleT4Regular.enabled.root,
  label4Bold: typoVars.textStyleT2Bold.enabled.root,
  label4Regular: typoVars.textStyleT2Regular.enabled.root,
  label5Bold: typoVars.textStyleT1Bold.enabled.root,
  label5Regular: typoVars.textStyleT1Regular.enabled.root,
  label6Bold: typoVars.textStyleT1Bold.enabled.root,
  label6Regular: typoVars.textStyleT1Regular.enabled.root,
};

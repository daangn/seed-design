// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/css";
import { f, reset } from "@/shared/styles";

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
// @ts-nocheck
import { style } from "@vanilla-extract/css";
import { vars } from "@seed-design/css";
import { f, reset } from "@/shared/styles";

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
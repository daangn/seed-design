import { classNames, vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

export const breadcrumbs = style([
  classNames.$semantic.typography.label3Bold,
  {
    color: vars.$scale.color.gray600,
  },
]);

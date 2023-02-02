import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";

export const linkText = style([
  {
    color: vars.$scale.color.blue600,
    fontSize: "12px",

    ":hover": {
      color: vars.$scale.color.blue900,
      textDecoration: "underline",
    },
  },
]);

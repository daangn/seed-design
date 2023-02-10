import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const td = style([
  {
    position: "relative",
    padding: "16px 30px",
    fontSize: "12px",
    fontWeight: "500",

    borderBottom: `1px solid ${vars.$scale.color.gray100}`,

    whiteSpace: "nowrap",
  },
]);

export const linkText = recipe({
  base: [
    {
      ":hover": {
        textDecoration: "underline",
      },
    },
  ],
  variants: {
    status: {
      todo: {
        color: vars.$scale.color.gray400,
        pointerEvents: "none",
      },
      "in-progress": {
        color: vars.$semantic.color.primary,
        textDecoration: "underline",

        ":hover": {
          color: vars.$scale.color.carrot700,
        },
      },
      done: {
        color: vars.$semantic.color.success,
        textDecoration: "underline",

        ":hover": {
          color: vars.$scale.color.green700,
        },
      },
    },
  },
});

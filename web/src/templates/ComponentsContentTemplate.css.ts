import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const title = style({
  fontSize: "66px",
  fontWeight: 700,

  marginTop: "35px",
  marginBottom: "10px",
});

export const titleDescription = style({
  color: vars.$scale.color.gray500,
});

export const tabLink = recipe({
  base: {
    display: "flex",
    padding: "10px",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
  },
  variants: {
    active: {
      true: {
        backgroundColor: vars.$scale.color.gray200,
      },
    },
  },
});

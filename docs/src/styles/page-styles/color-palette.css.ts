import { vars } from "@seed-design/design-token";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const container = style({
  display: "flex",
  flexDirection: "column",

  gap: "20px",

  borderRadius: "20px",
  border: `1px solid ${vars.$semantic.color.divider1}`,

  marginTop: "60px",
  padding: "20px",
});

export const subtitle = style({
  color: vars.$scale.color.gray800,

  fontSize: "18px",
});

export const colorContainer = style({
  display: "flex",
  flexWrap: "wrap",

  borderRadius: "10px",
  overflow: "hidden",
});

export const colorBox = style({
  padding: "10px",

  flex: "1 1 76px",

  width: "100%",
  height: "76px",
});

export const colorDescription = recipe({
  base: {
    display: "flex",
    flexDirection: "column",

    fontSize: "12px",
  },
  variants: {
    inversion: {
      true: {
        color: vars.$scale.color.gray00,
      },
    },
  },
});

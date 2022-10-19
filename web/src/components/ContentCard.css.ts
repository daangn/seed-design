import { vars } from "@seed-design/design-token";
import { recipe } from "@vanilla-extract/recipes";

export const contentCard = recipe({
  base: [
    {
      display: "flex",
      alignItems: "center",
      columnGap: "10px",
      padding: "10px",
      margin: "8px",
      borderRadius: "10px",
      color: vars.$scale.color.gray00,
      transition: "background-color 0.3s ease",

      ":hover": {
        backgroundColor: vars.$scale.color.green700,
      },
    },
  ],

  variants: {
    highlight: {
      true: [
        {
          backgroundColor: vars.$scale.color.green600,
        },
      ],
    },
  },
});

import { vars } from "@seed-design/design-token";
import { recipe } from "@vanilla-extract/recipes";

import { sidebarItemBase } from "./Sidebar.css";

export const link = recipe({
  variants: {
    disable: {
      true: {
        pointerEvents: "none",
      },
    },
  },
});

export const item = recipe({
  base: [sidebarItemBase],

  variants: {
    highlight: {
      true: [
        {
          fontWeight: "bold",
          color: vars.$semantic.color.primary,
          backgroundColor: vars.$semantic.color.primaryLow,

          ":hover": {
            backgroundColor: vars.$semantic.color.primaryLowActive,
          },
        },
      ],
    },

    disable: {
      true: {
        color: vars.$scale.color.gray400,
      },
    },

    hasDeps: {
      true: {
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
  },
});

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
    highlight: {
      true: {
        backgroundColor: vars.$scale.color.carrot50,
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

export const tab = recipe({
  base: [
    {
      width: "100%",
      fontSize: "14px",
      fontWeight: "500",

      color: vars.$scale.color.gray600,
      listStyle: "inside",

      transition: "background 0.2s ease",
      padding: "6px 10px",
      cursor: "pointer",
    },
  ],
  variants: {
    active: {
      true: {
        color: vars.$semantic.color.primary,
      },
      false: {
        ":hover": {
          color: vars.$semantic.color.primaryHover,
        },
      },
    },

    hasDeps: {
      true: {
        paddingLeft: "26px",
        paddingRight: "20px",
      },
    },
  },
});

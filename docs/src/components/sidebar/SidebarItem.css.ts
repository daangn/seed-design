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

export const tab = recipe({
  base: [
    {
      display: "flex",
      alignItems: "center",

      width: "100%",
      fontSize: "14px",
      fontWeight: "500",

      color: vars.$scale.color.gray600,
      listStyle: "none",

      transition: "background 0.2s ease",
      cursor: "pointer",
    },
  ],
  variants: {
    hasDeps: {
      true: {
        ":before": {
          content: "",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          marginRight: "8px",
          backgroundColor: vars.$scale.color.gray600,
        },
      },
      false: {
        padding: "8px 16px 8px 30px",
      },
    },

    active: {
      true: {
        color: vars.$scale.color.gray700,
        fontWeight: "bold",

        ":before": {
          backgroundColor: vars.$scale.color.gray900,
        },
      },
      false: {
        ":hover": {
          color: vars.$scale.color.gray700,
        },
      },
    },

    isLast: {
      true: {
        padding: "6px 16px 8px 20px",
      },
      false: {
        padding: "8px 16px 6px 20px",
      },
    },
  },
});

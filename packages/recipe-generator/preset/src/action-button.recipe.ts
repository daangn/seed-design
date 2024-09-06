import { vars } from "./__generated__/action-button.vars";
import { defineRecipe } from "./helper";
import { disabled, focus, active, pseudo } from "./pseudo";

const actionButton = defineRecipe({
  name: "actionButton",
  slots: ["root", "label", "prefix"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textDecoration: "none",
      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },

      fontWeight: vars.base.enabled.label.fontWeight,
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  variants: {
    variant: {
      brandSolid: {
        root: {
          background: vars.variantBrandSolid.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantBrandSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandSolid.disabled.root.color,
          },
        },
        label: {
          color: vars.variantBrandSolid.enabled.label.color,
        },
        prefix: {
          color: vars.variantBrandSolid.enabled.prefixIcon.color,
        },
      },
      brandWeak: {
        root: {
          background: vars.variantBrandWeak.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantBrandWeak.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandWeak.disabled.root.color,
          },
        },
        label: {
          color: vars.variantBrandWeak.enabled.label.color,
        },
        prefix: {
          color: vars.variantBrandWeak.enabled.prefixIcon.color,
        },
      },
      neutralSolid: {
        root: {
          background: vars.variantNeutralSolid.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantNeutralSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutralSolid.disabled.root.color,
          },
        },
        label: {
          color: vars.variantNeutralSolid.enabled.label.color,
        },
        prefix: {
          color: vars.variantNeutralSolid.enabled.prefixIcon.color,
        },
      },
      neutralWeak: {
        root: {
          background: vars.variantNeutralWeak.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantNeutralWeak.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutralWeak.disabled.root.color,
          },
        },
        label: {
          color: vars.variantNeutralWeak.enabled.label.color,
        },
        prefix: {
          color: vars.variantNeutralWeak.enabled.prefixIcon.color,
        },
      },
      dangerSolid: {
        root: {
          background: vars.variantDangerSolid.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantDangerSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantDangerSolid.disabled.root.color,
          },
        },
        label: {
          color: vars.variantDangerSolid.enabled.label.color,
        },
        prefix: {
          color: vars.variantDangerSolid.enabled.prefixIcon.color,
        },
      },
    },
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          padding: `${vars.sizeXsmall.enabled.root.paddingY} ${vars.sizeXsmall.enabled.root.paddingX}`,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,
          gap: vars.sizeXsmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeXsmall.enabled.label.fontSize,
        },
        prefix: {
          width: vars.sizeXsmall.enabled.prefixIcon.size,
          height: vars.sizeXsmall.enabled.prefixIcon.size,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          padding: `${vars.sizeSmall.enabled.root.paddingY} ${vars.sizeSmall.enabled.root.paddingX}`,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
          gap: vars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
        },
        prefix: {
          width: vars.sizeSmall.enabled.prefixIcon.size,
          height: vars.sizeSmall.enabled.prefixIcon.size,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.minHeight,
          padding: `${vars.sizeMedium.enabled.root.paddingY} ${vars.sizeMedium.enabled.root.paddingX}`,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
        },
        prefix: {
          width: vars.sizeMedium.enabled.prefixIcon.size,
          height: vars.sizeMedium.enabled.prefixIcon.size,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.minHeight,
          padding: `${vars.sizeLarge.enabled.root.paddingY} ${vars.sizeLarge.enabled.root.paddingX}`,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          gap: vars.sizeLarge.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
        },
        prefix: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,
        },
      },
    },
  },
});

export default actionButton;

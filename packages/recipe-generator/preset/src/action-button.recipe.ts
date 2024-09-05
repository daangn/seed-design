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
      brand: {
        root: {
          background: vars.variantBrand.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantBrand.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrand.disabled.root.color,
          },
        },
        label: {
          color: vars.variantBrand.enabled.label.color,
        },
        prefix: {
          color: vars.variantBrand.enabled.prefixIcon.color,
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
      danger: {
        root: {
          background: vars.variantDanger.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantDanger.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantDanger.disabled.root.color,
          },
        },
        label: {
          color: vars.variantDanger.enabled.label.color,
        },
        prefix: {
          color: vars.variantDanger.enabled.prefixIcon.color,
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

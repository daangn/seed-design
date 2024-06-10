import { vars } from "./__generated__/box-button.vars";
import { defineRecipe } from "./helper";
import { disabled, focus, active, pseudo } from "./pseudo";

const boxButton = defineRecipe({
  name: "boxButton",
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
      brandSoft: {
        root: {
          background: vars.variantBrandSoft.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantBrandSoft.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandSoft.disabled.root.color,
          },
        },
        label: {
          color: vars.variantBrandSoft.enabled.label.color,
        },
        prefix: {
          color: vars.variantBrandSoft.enabled.prefixIcon.color,
        },
      },
      neutral: {
        root: {
          background: vars.variantNeutral.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantNeutral.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutral.disabled.root.color,
          },
        },
        label: {
          color: vars.variantNeutral.enabled.label.color,
        },
        prefix: {
          color: vars.variantNeutral.enabled.prefixIcon.color,
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
      xlarge: {
        root: {
          height: vars.sizeXlarge.enabled.root.minHeight,
          padding: `${vars.sizeXlarge.enabled.root.paddingY} ${vars.sizeXlarge.enabled.root.paddingX}`,
          borderRadius: vars.sizeXlarge.enabled.root.cornerRadius,
          gap: vars.sizeXlarge.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeXlarge.enabled.label.fontSize,
        },
        prefix: {
          width: vars.sizeXlarge.enabled.prefixIcon.size,
          height: vars.sizeXlarge.enabled.prefixIcon.size,
        },
      },
    },
  },
});

export default boxButton;

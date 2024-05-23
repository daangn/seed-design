import { vars } from "./__generated__/box-button.vars";
import { defineRecipe } from "./helper";
import { disabled, focus, pressed, pseudo } from "./pseudo";

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

      fontWeight: vars.base.label.fontWeight,
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
          [pseudo(pressed)]: {
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
      neutral: {
        root: {
          background: vars.variantNeutral.enabled.root.color,
          [pseudo(pressed)]: {
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
    },
    size: {
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
    },
  },
});

export default boxButton;

import { vars } from "./__generated__/action-button.vars";
import { defineRecipe } from "./helper";
import { disabled, focus, active, pseudo } from "./pseudo";

const actionButton = defineRecipe({
  name: "actionButton",
  slots: ["root", "label", "icon", "prefixIcon", "suffixIcon"],
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
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    suffixIcon: {
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
        icon: {
          color: vars.variantBrandSolid.enabled.icon.color,
        },
        prefixIcon: {
          color: vars.variantBrandSolid.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantBrandSolid.enabled.suffixIcon.color,
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
        icon: {
          color: vars.variantBrandWeak.enabled.icon.color,
        },
        prefixIcon: {
          color: vars.variantBrandWeak.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantBrandWeak.enabled.suffixIcon.color,
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
        icon: {
          color: vars.variantNeutralSolid.enabled.icon.color,
        },
        prefixIcon: {
          color: vars.variantNeutralSolid.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantNeutralSolid.enabled.suffixIcon.color,
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
        icon: {
          color: vars.variantNeutralWeak.enabled.icon.color,
        },
        prefixIcon: {
          color: vars.variantNeutralWeak.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantNeutralWeak.enabled.suffixIcon.color,
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
        icon: {
          color: vars.variantDangerSolid.enabled.icon.color,
        },
        prefixIcon: {
          color: vars.variantDangerSolid.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantDangerSolid.enabled.suffixIcon.color,
        },
      },
    },
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
      },
    },
    layout: {
      withText: {},
      iconOnly: {},
    },
  },
  compoundVariants: [
    {
      size: "xsmall",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeXsmallLayoutWithText.enabled.root.gap,
          paddingInline: vars.sizeXsmallLayoutWithText.enabled.root.paddingX,
          paddingBlock: vars.sizeXsmallLayoutWithText.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeXsmallLayoutWithText.enabled.label.fontSize,
        },
        prefixIcon: {
          width: vars.sizeXsmallLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeXsmallLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeXsmallLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeXsmallLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "xsmall",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeXsmallLayoutIconOnly.enabled.root.minWidth,
          paddingInline: vars.sizeXsmallLayoutIconOnly.enabled.root.paddingX,
          paddingBlock: vars.sizeXsmallLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeXsmallLayoutIconOnly.enabled.icon.size,
          height: vars.sizeXsmallLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeSmallLayoutWithText.enabled.root.gap,
          paddingInline: vars.sizeSmallLayoutWithText.enabled.root.paddingX,
          paddingBlock: vars.sizeSmallLayoutWithText.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeSmallLayoutWithText.enabled.label.fontSize,
        },
        prefixIcon: {
          width: vars.sizeSmallLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeSmallLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeSmallLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeSmallLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
          paddingInline: vars.sizeSmallLayoutIconOnly.enabled.root.paddingX,
          paddingBlock: vars.sizeSmallLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
          height: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeMediumLayoutWithText.enabled.root.gap,
          paddingInline: vars.sizeMediumLayoutWithText.enabled.root.paddingX,
          paddingBlock: vars.sizeMediumLayoutWithText.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeMediumLayoutWithText.enabled.label.fontSize,
        },
        prefixIcon: {
          width: vars.sizeMediumLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeMediumLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeMediumLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeMediumLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
          paddingInline: vars.sizeMediumLayoutIconOnly.enabled.root.paddingX,
          paddingBlock: vars.sizeMediumLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
          height: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeLargeLayoutWithText.enabled.root.gap,
          paddingInline: vars.sizeLargeLayoutWithText.enabled.root.paddingX,
          paddingBlock: vars.sizeLargeLayoutWithText.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeLargeLayoutWithText.enabled.label.fontSize,
        },
        prefixIcon: {
          width: vars.sizeLargeLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeLargeLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeLargeLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeLargeLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutIconOnly.enabled.root.minWidth,
          paddingInline: vars.sizeLargeLayoutIconOnly.enabled.root.paddingX,
          paddingBlock: vars.sizeLargeLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeLargeLayoutIconOnly.enabled.icon.size,
          height: vars.sizeLargeLayoutIconOnly.enabled.icon.size,
        },
      },
    },
  ],
});

export default actionButton;

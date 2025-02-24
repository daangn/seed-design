import { actionButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { disabled, focus, active, pseudo, loading } from "../utils/pseudo";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";

const actionButton = defineRecipe({
  name: "action-button",
  slots: ["root"],
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
      flexShrink: 0,
      fontFamily: "inherit",

      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,

      fontWeight: vars.base.enabled.label.fontWeight,
    },
  },
  variants: {
    variant: {
      brandSolid: {
        root: {
          background: vars.variantBrandSolid.enabled.root.color,
          color: vars.variantBrandSolid.enabled.label.color,

          ...prefixIcon({
            color: vars.variantBrandSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantBrandSolid.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantBrandSolid.enabled.icon.color,
          }),

          "--track-color": vars.variantBrandSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantBrandSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandSolid.disabled.root.color,
            color: vars.variantBrandSolid.disabled.label.color,
            ...prefixIcon({
              color: vars.variantBrandSolid.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantBrandSolid.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantBrandSolid.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantBrandSolid.loading.root.color,
          },
        },
      },
      neutralSolid: {
        root: {
          background: vars.variantNeutralSolid.enabled.root.color,
          color: vars.variantNeutralSolid.enabled.label.color,
          ...prefixIcon({
            color: vars.variantNeutralSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralSolid.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantNeutralSolid.enabled.icon.color,
          }),

          "--track-color": vars.variantNeutralSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantNeutralSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutralSolid.disabled.root.color,
            color: vars.variantNeutralSolid.disabled.label.color,

            ...prefixIcon({
              color: vars.variantNeutralSolid.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantNeutralSolid.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantNeutralSolid.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantNeutralSolid.loading.root.color,
          },
        },
      },
      neutralWeak: {
        root: {
          background: vars.variantNeutralWeak.enabled.root.color,
          color: vars.variantNeutralWeak.enabled.label.color,
          ...prefixIcon({
            color: vars.variantNeutralWeak.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralWeak.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantNeutralWeak.enabled.icon.color,
          }),

          "--track-color": vars.variantNeutralWeak.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralWeak.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantNeutralWeak.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutralWeak.disabled.root.color,
            color: vars.variantNeutralWeak.disabled.label.color,

            ...prefixIcon({
              color: vars.variantNeutralWeak.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantNeutralWeak.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantNeutralWeak.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantNeutralWeak.loading.root.color,
          },
        },
      },
      criticalSolid: {
        root: {
          background: vars.variantCriticalSolid.enabled.root.color,
          color: vars.variantCriticalSolid.enabled.label.color,
          ...prefixIcon({
            color: vars.variantCriticalSolid.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantCriticalSolid.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantCriticalSolid.enabled.icon.color,
          }),

          "--track-color": vars.variantCriticalSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantCriticalSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantCriticalSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantCriticalSolid.disabled.root.color,
            color: vars.variantCriticalSolid.disabled.label.color,

            ...prefixIcon({
              color: vars.variantCriticalSolid.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantCriticalSolid.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantCriticalSolid.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantCriticalSolid.loading.root.color,
          },
        },
      },
      brandOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantBrandOutline.enabled.root.color,
          borderWidth: vars.variantBrandOutline.enabled.root.strokeWidth,
          borderColor: vars.variantBrandOutline.enabled.root.strokeColor,
          color: vars.variantBrandOutline.enabled.label.color,
          ...prefixIcon({
            color: vars.variantBrandOutline.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantBrandOutline.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantBrandOutline.enabled.icon.color,
          }),

          "--track-color": vars.variantBrandOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandOutline.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantBrandOutline.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandOutline.disabled.root.color,
            borderColor: vars.variantBrandOutline.disabled.root.strokeColor,
            color: vars.variantBrandOutline.disabled.label.color,

            ...prefixIcon({
              color: vars.variantBrandOutline.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantBrandOutline.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantBrandOutline.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantBrandOutline.loading.root.color,
          },
        },
      },
      neutralOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantNeutralOutline.enabled.root.color,
          borderWidth: vars.variantNeutralOutline.enabled.root.strokeWidth,
          borderColor: vars.variantNeutralOutline.enabled.root.strokeColor,
          color: vars.variantNeutralOutline.enabled.label.color,
          ...prefixIcon({
            color: vars.variantNeutralOutline.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralOutline.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantNeutralOutline.enabled.icon.color,
          }),

          "--track-color": vars.variantNeutralOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralOutline.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantNeutralOutline.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantNeutralOutline.disabled.root.color,
            borderColor: vars.variantNeutralOutline.disabled.root.strokeColor,
            color: vars.variantNeutralOutline.disabled.label.color,

            ...prefixIcon({
              color: vars.variantNeutralOutline.disabled.prefixIcon.color,
            }),
            ...suffixIcon({
              color: vars.variantNeutralOutline.disabled.suffixIcon.color,
            }),
            ...onlyIcon({
              color: vars.variantNeutralOutline.disabled.icon.color,
            }),
          },
          [pseudo(loading)]: {
            background: vars.variantNeutralOutline.loading.root.color,
          },
        },
      },
    },
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,

          "--size": vars.sizeXsmall.enabled.progressCircle.size,
          "--thickness": vars.sizeXsmall.enabled.progressCircle.thickness,

          ...prefixIcon({
            size: vars.sizeXsmallLayoutWithText.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeXsmallLayoutWithText.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: vars.sizeXsmallLayoutIconOnly.enabled.icon.size,
          }),
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,

          "--size": vars.sizeSmall.enabled.progressCircle.size,
          "--thickness": vars.sizeSmall.enabled.progressCircle.thickness,

          ...prefixIcon({
            size: vars.sizeSmallLayoutWithText.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeSmallLayoutWithText.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
          }),
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,

          "--size": vars.sizeMedium.enabled.progressCircle.size,
          "--thickness": vars.sizeMedium.enabled.progressCircle.thickness,

          ...prefixIcon({
            size: vars.sizeMediumLayoutWithText.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeMediumLayoutWithText.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
          }),
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,

          "--size": vars.sizeLarge.enabled.progressCircle.size,
          "--thickness": vars.sizeLarge.enabled.progressCircle.thickness,

          ...prefixIcon({
            size: vars.sizeLargeLayoutWithText.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeLargeLayoutWithText.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: vars.sizeLargeLayoutIconOnly.enabled.icon.size,
          }),
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
          fontSize: vars.sizeXsmallLayoutWithText.enabled.label.fontSize,
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
          fontSize: vars.sizeSmallLayoutWithText.enabled.label.fontSize,
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
          fontSize: vars.sizeMediumLayoutWithText.enabled.label.fontSize,
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
          fontSize: vars.sizeLargeLayoutWithText.enabled.label.fontSize,
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
      },
    },
  ],
  defaultVariants: {
    variant: "brandSolid",
    size: "medium",
    layout: "withText",
  },
});

export default actionButton;

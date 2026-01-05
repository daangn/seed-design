import { actionButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { active, disabled, focus, loading, pseudo } from "../utils/pseudo";

const actionButton = defineRecipe({
  name: "action-button",
  base: {
    display: "inline-flex",
    position: "relative",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    textTransform: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",
    flexShrink: 0,
    fontFamily: "inherit",

    // Intentional duplication with seed-box; we'll adjust utility styles later
    "--seed-box-flex-grow": "initial",
    flexGrow: "var(--seed-box-flex-grow)",
    "--seed-box-min-width": "initial",
    minWidth: "var(--seed-box-min-width)",

    "--seed-box-padding-bottom": "initial",
    "--seed-box-padding-top": "initial",
    "--seed-box-padding-left": "initial",
    "--seed-box-padding-right": "initial",
    paddingTop: "var(--seed-box-padding-top)",
    paddingBottom: "var(--seed-box-padding-bottom)",
    paddingLeft: "var(--seed-box-padding-left)",
    paddingRight: "var(--seed-box-padding-right)",

    "--seed-box-bleed-bottom": "0px",
    "--seed-box-bleed-top": "0px",
    "--seed-box-bleed-left": "0px",
    "--seed-box-bleed-right": "0px",
    marginTop: "calc(var(--seed-box-bleed-top) * -1)",
    marginBottom: "calc(var(--seed-box-bleed-bottom) * -1)",
    marginLeft: "calc(var(--seed-box-bleed-left) * -1)",
    marginRight: "calc(var(--seed-box-bleed-right) * -1)",

    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
  },
  variants: {
    variant: {
      brandSolid: {
        background: vars.variantBrandSolid.enabled.root.color,
        color: vars.variantBrandSolid.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      neutralSolid: {
        background: vars.variantNeutralSolid.enabled.root.color,
        color: vars.variantNeutralSolid.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      neutralWeak: {
        background: vars.variantNeutralWeak.enabled.root.color,
        color: vars.variantNeutralWeak.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      criticalSolid: {
        background: vars.variantCriticalSolid.enabled.root.color,
        color: vars.variantCriticalSolid.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      brandOutline: {
        borderStyle: "solid",
        background: vars.variantBrandOutline.enabled.root.color,
        borderWidth: vars.variantBrandOutline.enabled.root.strokeWidth,
        borderColor: vars.variantBrandOutline.enabled.root.strokeColor,
        color: vars.variantBrandOutline.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      neutralOutline: {
        borderStyle: "solid",
        background: vars.variantNeutralOutline.enabled.root.color,
        borderWidth: vars.variantNeutralOutline.enabled.root.strokeWidth,
        borderColor: vars.variantNeutralOutline.enabled.root.strokeColor,
        color: vars.variantNeutralOutline.enabled.label.color,

        fontWeight: vars.base.enabled.label.fontWeight,

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
      ghost: {
        background: vars.variantGhost.enabled.root.color,

        "--seed-box-color": vars.variantGhost.enabled.label.color,

        color: "var(--seed-box-color)",
        ...prefixIcon({
          color: "var(--seed-box-color)",
        }),
        ...suffixIcon({
          color: "var(--seed-box-color)",
        }),
        ...onlyIcon({
          color: "var(--seed-box-color)",
        }),

        "--seed-font-weight": vars.base.enabled.label.fontWeight,
        fontWeight: "var(--seed-font-weight)",

        "--track-color": vars.variantGhost.enabled.progressCircle.trackColor,
        "--range-color": vars.variantGhost.enabled.progressCircle.rangeColor,
        [pseudo(active)]: {
          background: vars.variantGhost.pressed.root.color,
        },
        [pseudo(disabled)]: {
          background: vars.variantGhost.disabled.root.color,
          color: vars.variantGhost.disabled.label.color,
          ...prefixIcon({
            color: vars.variantGhost.disabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantGhost.disabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantGhost.disabled.icon.color,
          }),
        },
        [pseudo(loading)]: {
          background: vars.variantGhost.loading.root.color,
        },
      },
    },
    size: {
      xsmall: {
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
      small: {
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
      medium: {
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
      large: {
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
        gap: vars.sizeXsmallLayoutWithText.enabled.root.gap,
        "--seed-box-padding-left": vars.sizeXsmallLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeXsmallLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeXsmallLayoutWithText.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeXsmallLayoutWithText.enabled.root.paddingY,
        fontSize: vars.sizeXsmallLayoutWithText.enabled.label.fontSize,
        lineHeight: vars.sizeXsmallLayoutWithText.enabled.label.lineHeight,
      },
    },
    {
      size: "xsmall",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeXsmallLayoutIconOnly.enabled.root.minWidth,
        "--seed-box-padding-left": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingY,
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        gap: vars.sizeSmallLayoutWithText.enabled.root.gap,
        "--seed-box-padding-left": vars.sizeSmallLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeSmallLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeSmallLayoutWithText.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeSmallLayoutWithText.enabled.root.paddingY,
        fontSize: vars.sizeSmallLayoutWithText.enabled.label.fontSize,
        lineHeight: vars.sizeSmallLayoutWithText.enabled.label.lineHeight,
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
        "--seed-box-padding-left": vars.sizeSmallLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeSmallLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeSmallLayoutIconOnly.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeSmallLayoutIconOnly.enabled.root.paddingY,
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        gap: vars.sizeMediumLayoutWithText.enabled.root.gap,
        "--seed-box-padding-left": vars.sizeMediumLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeMediumLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeMediumLayoutWithText.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeMediumLayoutWithText.enabled.root.paddingY,
        fontSize: vars.sizeMediumLayoutWithText.enabled.label.fontSize,
        lineHeight: vars.sizeMediumLayoutWithText.enabled.label.lineHeight,
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
        "--seed-box-padding-left": vars.sizeMediumLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeMediumLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeMediumLayoutIconOnly.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeMediumLayoutIconOnly.enabled.root.paddingY,
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        gap: vars.sizeLargeLayoutWithText.enabled.root.gap,
        "--seed-box-padding-left": vars.sizeLargeLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeLargeLayoutWithText.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeLargeLayoutWithText.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeLargeLayoutWithText.enabled.root.paddingY,
        fontSize: vars.sizeLargeLayoutWithText.enabled.label.fontSize,
        lineHeight: vars.sizeLargeLayoutWithText.enabled.label.lineHeight,
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeLargeLayoutIconOnly.enabled.root.minWidth,
        "--seed-box-padding-left": vars.sizeLargeLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-right": vars.sizeLargeLayoutIconOnly.enabled.root.paddingX,
        "--seed-box-padding-top": vars.sizeLargeLayoutIconOnly.enabled.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeLargeLayoutIconOnly.enabled.root.paddingY,
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

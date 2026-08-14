import spec from "@seed-design/rootage-artifacts/components/action-button";
import { actionButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { active, engaged, disabled, focusVisible, loading, not, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

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

    "--seed-box-bleed-bottom--responsive": "0px",
    "--seed-box-bleed-top--responsive": "0px",
    "--seed-box-bleed-left--responsive": "0px",
    "--seed-box-bleed-right--responsive": "0px",
    marginTop: "calc(var(--seed-box-bleed-top) * -1)",
    marginBottom: "calc(var(--seed-box-bleed-bottom) * -1)",
    marginLeft: "calc(var(--seed-box-bleed-left) * -1)",
    marginRight: "calc(var(--seed-box-bleed-right) * -1)",

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),

    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    // Individual `scale` over `transform: scale()` — progressive enhancement for Chrome 104+ (older browsers just skip the pressed scale).
    scale: "1",

    transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, scale ${vars.base.rest.root.scaleDuration} ${vars.base.rest.root.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,
  },
  variants: {
    // TODO: every variant below writes its `disabled` block before its `loading`
    // block, and the two selectors have equal specificity, so a button that is both
    // renders the loading background over the disabled foreground. The spec now
    // ranks `disabled` above `loading` (packages/rootage/components/action-button.yaml),
    // so swapping the two blocks would make this agree with it — held back because
    // it changes rendered output and wants a design review first.
    variant: {
      brandSolid: {
        background: vars.variantBrandSolid.rest.root.color,
        color: vars.variantBrandSolid.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantBrandSolid.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantBrandSolid.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantBrandSolid.rest.icon.color,
        }),

        "--track-color": vars.variantBrandSolid.rest.progressCircle.trackColor,
        "--range-color": vars.variantBrandSolid.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantNeutralSolid.rest.root.color,
        color: vars.variantNeutralSolid.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantNeutralSolid.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantNeutralSolid.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantNeutralSolid.rest.icon.color,
        }),

        "--track-color": vars.variantNeutralSolid.rest.progressCircle.trackColor,
        "--range-color": vars.variantNeutralSolid.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantNeutralWeak.rest.root.color,
        color: vars.variantNeutralWeak.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantNeutralWeak.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantNeutralWeak.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantNeutralWeak.rest.icon.color,
        }),

        "--track-color": vars.variantNeutralWeak.rest.progressCircle.trackColor,
        "--range-color": vars.variantNeutralWeak.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantCriticalSolid.rest.root.color,
        color: vars.variantCriticalSolid.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantCriticalSolid.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantCriticalSolid.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantCriticalSolid.rest.icon.color,
        }),

        "--track-color": vars.variantCriticalSolid.rest.progressCircle.trackColor,
        "--range-color": vars.variantCriticalSolid.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantBrandOutline.rest.root.color,
        borderWidth: vars.variantBrandOutline.rest.root.strokeWidth,
        borderColor: vars.variantBrandOutline.rest.root.strokeColor,
        color: vars.variantBrandOutline.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantBrandOutline.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantBrandOutline.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantBrandOutline.rest.icon.color,
        }),

        "--track-color": vars.variantBrandOutline.rest.progressCircle.trackColor,
        "--range-color": vars.variantBrandOutline.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantNeutralOutline.rest.root.color,
        borderWidth: vars.variantNeutralOutline.rest.root.strokeWidth,
        borderColor: vars.variantNeutralOutline.rest.root.strokeColor,
        color: vars.variantNeutralOutline.rest.label.color,

        fontWeight: vars.base.rest.label.fontWeight,

        ...prefixIcon({
          color: vars.variantNeutralOutline.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantNeutralOutline.rest.suffixIcon.color,
        }),
        ...onlyIcon({
          color: vars.variantNeutralOutline.rest.icon.color,
        }),

        "--track-color": vars.variantNeutralOutline.rest.progressCircle.trackColor,
        "--range-color": vars.variantNeutralOutline.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantGhost.rest.root.color,

        "--seed-box-color": vars.variantGhost.rest.label.color,

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

        "--seed-font-weight": vars.base.rest.label.fontWeight,
        fontWeight: "var(--seed-font-weight)",

        "--track-color": vars.variantGhost.rest.progressCircle.trackColor,
        "--range-color": vars.variantGhost.rest.progressCircle.rangeColor,
        [pseudo(engaged)]: {
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
        height: vars.sizeXsmall.rest.root.minHeight,
        borderRadius: vars.sizeXsmall.rest.root.cornerRadius,

        "--size": vars.sizeXsmall.rest.progressCircle.size,
        "--thickness": vars.sizeXsmall.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeXsmallLayoutWithText.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeXsmallLayoutWithText.rest.suffixIcon.size,
        }),
        ...onlyIcon({
          size: vars.sizeXsmallLayoutIconOnly.rest.icon.size,
        }),

        [pseudo(not(disabled), active)]: {
          scale: vars.sizeXsmall.pressed.root.scale,
        },
      },
      small: {
        height: vars.sizeSmall.rest.root.minHeight,
        borderRadius: vars.sizeSmall.rest.root.cornerRadius,

        "--size": vars.sizeSmall.rest.progressCircle.size,
        "--thickness": vars.sizeSmall.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeSmallLayoutWithText.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeSmallLayoutWithText.rest.suffixIcon.size,
        }),
        ...onlyIcon({
          size: vars.sizeSmallLayoutIconOnly.rest.icon.size,
        }),

        [pseudo(not(disabled), active)]: {
          scale: vars.sizeSmall.pressed.root.scale,
        },
      },
      medium: {
        height: vars.sizeMedium.rest.root.minHeight,
        borderRadius: vars.sizeMedium.rest.root.cornerRadius,

        "--size": vars.sizeMedium.rest.progressCircle.size,
        "--thickness": vars.sizeMedium.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeMediumLayoutWithText.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeMediumLayoutWithText.rest.suffixIcon.size,
        }),
        ...onlyIcon({
          size: vars.sizeMediumLayoutIconOnly.rest.icon.size,
        }),

        [pseudo(not(disabled), active)]: {
          scale: vars.sizeMedium.pressed.root.scale,
        },
      },
      large: {
        height: vars.sizeLarge.rest.root.minHeight,
        borderRadius: vars.sizeLarge.rest.root.cornerRadius,

        "--size": vars.sizeLarge.rest.progressCircle.size,
        "--thickness": vars.sizeLarge.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeLargeLayoutWithText.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeLargeLayoutWithText.rest.suffixIcon.size,
        }),
        ...onlyIcon({
          size: vars.sizeLargeLayoutIconOnly.rest.icon.size,
        }),

        [pseudo(not(disabled), active)]: {
          scale: vars.sizeLarge.pressed.root.scale,
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
        gap: vars.sizeXsmallLayoutWithText.rest.root.gap,
        "--seed-box-padding-left": vars.sizeXsmallLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeXsmallLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeXsmallLayoutWithText.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeXsmallLayoutWithText.rest.root.paddingY,
        fontSize: vars.sizeXsmallLayoutWithText.rest.label.fontSize,
        lineHeight: vars.sizeXsmallLayoutWithText.rest.label.lineHeight,
      },
    },
    {
      size: "xsmall",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeXsmallLayoutIconOnly.rest.root.minWidth,
        "--seed-box-padding-left": vars.sizeXsmallLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeXsmallLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeXsmallLayoutIconOnly.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeXsmallLayoutIconOnly.rest.root.paddingY,
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        gap: vars.sizeSmallLayoutWithText.rest.root.gap,
        "--seed-box-padding-left": vars.sizeSmallLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeSmallLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeSmallLayoutWithText.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeSmallLayoutWithText.rest.root.paddingY,
        fontSize: vars.sizeSmallLayoutWithText.rest.label.fontSize,
        lineHeight: vars.sizeSmallLayoutWithText.rest.label.lineHeight,
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeSmallLayoutIconOnly.rest.root.minWidth,
        "--seed-box-padding-left": vars.sizeSmallLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeSmallLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeSmallLayoutIconOnly.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeSmallLayoutIconOnly.rest.root.paddingY,
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        gap: vars.sizeMediumLayoutWithText.rest.root.gap,
        "--seed-box-padding-left": vars.sizeMediumLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeMediumLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeMediumLayoutWithText.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeMediumLayoutWithText.rest.root.paddingY,
        fontSize: vars.sizeMediumLayoutWithText.rest.label.fontSize,
        lineHeight: vars.sizeMediumLayoutWithText.rest.label.lineHeight,
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeMediumLayoutIconOnly.rest.root.minWidth,
        "--seed-box-padding-left": vars.sizeMediumLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeMediumLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeMediumLayoutIconOnly.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeMediumLayoutIconOnly.rest.root.paddingY,
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        gap: vars.sizeLargeLayoutWithText.rest.root.gap,
        "--seed-box-padding-left": vars.sizeLargeLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeLargeLayoutWithText.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeLargeLayoutWithText.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeLargeLayoutWithText.rest.root.paddingY,
        fontSize: vars.sizeLargeLayoutWithText.rest.label.fontSize,
        lineHeight: vars.sizeLargeLayoutWithText.rest.label.lineHeight,
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeLargeLayoutIconOnly.rest.root.minWidth,
        "--seed-box-padding-left": vars.sizeLargeLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-right": vars.sizeLargeLayoutIconOnly.rest.root.paddingX,
        "--seed-box-padding-top": vars.sizeLargeLayoutIconOnly.rest.root.paddingY,
        "--seed-box-padding-bottom": vars.sizeLargeLayoutIconOnly.rest.root.paddingY,
      },
    },
  ],
  defaultVariants: {
    variant: "brandSolid",
    size: "medium",
    layout: "withText",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default actionButton;

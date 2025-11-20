import { contextualFloatingButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon } from "../utils/icon";
import { active, disabled, focus, loading, pseudo } from "../utils/pseudo";

const contextualFloatingButton = defineRecipe({
  name: "contextual-floating-button",
  base: {
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
    fontFamily: "inherit",
    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    borderRadius: vars.base.enabled.root.cornerRadius,
    boxShadow: vars.base.enabled.root.shadow,

    fontSize: vars.layoutWithText.enabled.label.fontSize,
    lineHeight: vars.layoutWithText.enabled.label.lineHeight,
    fontWeight: vars.layoutWithText.enabled.label.fontWeight,

    "--seed-box-z-index": "initial",
    zIndex: "var(--seed-box-z-index)",

    "--seed-box-position": "initial",
    position: "var(--seed-box-position)",

    "--seed-box-top": "initial",
    "--seed-box-right": "initial",
    "--seed-box-bottom": "initial",
    "--seed-box-left": "initial",
    top: "var(--seed-box-top)",
    right: "var(--seed-box-right)",
    bottom: "var(--seed-box-bottom)",
    left: "var(--seed-box-left)",

    ...onlyIcon({
      size: vars.layoutIconOnly.enabled.icon.size,
    }),

    "--size": vars.base.enabled.progressCircle.size,
    "--thickness": vars.base.enabled.progressCircle.thickness,

    transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
  },
  variants: {
    variant: {
      solid: {
        background: vars.variantSolid.enabled.root.color,
        color: vars.variantSolid.enabled.label.color,
        ...onlyIcon({
          color: vars.variantSolid.enabled.icon.color,
        }),
        ...prefixIcon({
          color: vars.variantSolid.enabled.prefixIcon.color,
        }),
        "--track-color": vars.variantSolid.enabled.progressCircle.trackColor,
        "--range-color": vars.variantSolid.enabled.progressCircle.rangeColor,

        [pseudo(active)]: {
          background: vars.variantSolid.pressed.root.color,
        },
        [pseudo(disabled)]: {
          background: vars.variantSolid.disabled.root.color,
          color: vars.variantSolid.disabled.label.color,

          ...prefixIcon({
            color: vars.variantSolid.disabled.prefixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantSolid.disabled.icon.color,
          }),
        },
        [pseudo(loading)]: {
          background: vars.variantSolid.loading.root.color,
        },
      },
      layer: {
        background: vars.variantLayer.enabled.root.color,
        color: vars.variantLayer.enabled.label.color,
        ...onlyIcon({
          color: vars.variantLayer.enabled.icon.color,
        }),
        ...prefixIcon({
          color: vars.variantLayer.enabled.prefixIcon.color,
        }),
        "--track-color": vars.variantLayer.enabled.progressCircle.trackColor,
        "--range-color": vars.variantLayer.enabled.progressCircle.rangeColor,

        [pseudo(active)]: {
          background: vars.variantLayer.pressed.root.color,
        },
        [pseudo(disabled)]: {
          background: vars.variantLayer.disabled.root.color,
          color: vars.variantLayer.disabled.label.color,

          ...prefixIcon({
            color: vars.variantLayer.disabled.prefixIcon.color,
          }),
          ...onlyIcon({
            color: vars.variantLayer.disabled.icon.color,
          }),
        },
        [pseudo(loading)]: {
          background: vars.variantLayer.loading.root.color,
        },
      },
    },
    layout: {
      withText: {
        minHeight: vars.layoutWithText.enabled.root.minHeight,
        paddingLeft: vars.layoutWithText.enabled.root.paddingX,
        paddingRight: vars.layoutWithText.enabled.root.paddingX,
        paddingTop: vars.layoutWithText.enabled.root.paddingY,
        paddingBottom: vars.layoutWithText.enabled.root.paddingY,
        gap: vars.layoutWithText.enabled.root.gap,

        ...prefixIcon({
          size: vars.layoutWithText.enabled.prefixIcon.size,
        }),
      },
      iconOnly: {
        width: vars.layoutIconOnly.enabled.root.size,
        height: vars.layoutIconOnly.enabled.root.size,

        ...onlyIcon({
          size: vars.layoutIconOnly.enabled.icon.size,
        }),
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    layout: "withText",
  },
});

export default contextualFloatingButton;

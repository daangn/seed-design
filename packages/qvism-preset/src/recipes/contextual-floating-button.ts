import { contextualFloatingButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, loading, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/contextual-floating-button";

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
    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    borderRadius: vars.base.rest.root.cornerRadius,
    boxShadow: vars.base.rest.root.shadow,

    fontSize: vars.layoutWithText.rest.label.fontSize,
    lineHeight: vars.layoutWithText.rest.label.lineHeight,
    fontWeight: vars.layoutWithText.rest.label.fontWeight,

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
      size: vars.layoutIconOnly.rest.icon.size,
    }),

    "--size": vars.base.rest.progressCircle.size,
    "--thickness": vars.base.rest.progressCircle.thickness,

    transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,
  },
  variants: {
    // TODO: `disabled` is written before `loading` at equal specificity, so a
    // button that is both keeps the loading background. The spec ranks `disabled`
    // higher; swapping the blocks would match it, but it changes rendered output
    // and wants a design review first.
    variant: {
      solid: {
        background: vars.variantSolid.rest.root.color,
        color: vars.variantSolid.rest.label.color,
        ...onlyIcon({
          color: vars.variantSolid.rest.icon.color,
        }),
        ...prefixIcon({
          color: vars.variantSolid.rest.prefixIcon.color,
        }),
        "--track-color": vars.variantSolid.rest.progressCircle.trackColor,
        "--range-color": vars.variantSolid.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        background: vars.variantLayer.rest.root.color,
        color: vars.variantLayer.rest.label.color,
        ...onlyIcon({
          color: vars.variantLayer.rest.icon.color,
        }),
        ...prefixIcon({
          color: vars.variantLayer.rest.prefixIcon.color,
        }),
        "--track-color": vars.variantLayer.rest.progressCircle.trackColor,
        "--range-color": vars.variantLayer.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
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
        minHeight: vars.layoutWithText.rest.root.minHeight,
        paddingInline: vars.layoutWithText.rest.root.paddingX,
        paddingBlock: vars.layoutWithText.rest.root.paddingY,
        gap: vars.layoutWithText.rest.root.gap,

        ...prefixIcon({
          size: vars.layoutWithText.rest.prefixIcon.size,
        }),
      },
      iconOnly: {
        width: vars.layoutIconOnly.rest.root.size,
        height: vars.layoutIconOnly.rest.root.size,

        ...onlyIcon({
          size: vars.layoutIconOnly.rest.icon.size,
        }),
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    layout: "withText",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default contextualFloatingButton;

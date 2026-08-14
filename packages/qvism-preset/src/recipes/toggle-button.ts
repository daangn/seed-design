import spec from "@seed-design/rootage-artifacts/components/toggle-button";
import { toggleButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { prefixIcon, suffixIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, loading, pressed, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const toggleButton = defineRecipe({
  name: "toggle-button",
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

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,
    fontWeight: vars.base.rest.label.fontWeight,
  },
  variants: {
    // TODO: `disabled` is written before `loading` at equal specificity, so a
    // button that is both keeps the loading background. The spec ranks `disabled`
    // higher; swapping the blocks would match it, but it changes rendered output
    // and wants a design review first.
    variant: {
      brandSolid: {
        background: vars.variantBrandSolid.rest.root.color,
        color: vars.variantBrandSolid.rest.label.color,

        "--track-color": vars.variantBrandSolid.rest.progressCircle.trackColor,
        "--range-color": vars.variantBrandSolid.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
          background: vars.variantBrandSolid.pressed.root.color,
        },
        [pseudo(pressed)]: {
          background: vars.variantBrandSolid.selected.root.color,
          color: vars.variantBrandSolid.selected.label.color,

          "--track-color": vars.variantBrandSolid.selected.progressCircle.trackColor,
          "--range-color": vars.variantBrandSolid.selected.progressCircle.rangeColor,

          ...prefixIcon({
            color: vars.variantBrandSolid.selected.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantBrandSolid.selected.suffixIcon.color,
          }),
        },
        [pseudo(pressed, engaged)]: {
          background: vars.variantBrandSolid.pressedSelected.root.color,
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
        },
        [pseudo(loading)]: {
          background: vars.variantBrandSolid.loading.root.color,
        },
        [pseudo(pressed, loading)]: {
          background: vars.variantBrandSolid.selectedLoading.root.color,
        },

        ...prefixIcon({
          color: vars.variantBrandSolid.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantBrandSolid.rest.suffixIcon.color,
        }),
      },
      neutralWeak: {
        background: vars.variantNeutralWeak.rest.root.color,
        color: vars.variantNeutralWeak.rest.label.color,

        "--track-color": vars.variantNeutralWeak.rest.progressCircle.trackColor,
        "--range-color": vars.variantNeutralWeak.rest.progressCircle.rangeColor,

        [pseudo(engaged)]: {
          background: vars.variantNeutralWeak.pressed.root.color,
        },
        [pseudo(pressed)]: {
          background: vars.variantNeutralWeak.selected.root.color,
          color: vars.variantNeutralWeak.selected.label.color,

          "--track-color": vars.variantNeutralWeak.selected.progressCircle.trackColor,
          "--range-color": vars.variantNeutralWeak.selected.progressCircle.rangeColor,

          ...prefixIcon({
            color: vars.variantNeutralWeak.selected.prefixIcon.color,
          }),
          ...suffixIcon({
            color: vars.variantNeutralWeak.selected.suffixIcon.color,
          }),
        },
        [pseudo(pressed, engaged)]: {
          background: vars.variantNeutralWeak.pressedSelected.root.color,
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
        },
        [pseudo(loading)]: {
          background: vars.variantNeutralWeak.loading.root.color,
        },
        [pseudo(pressed, loading)]: {
          background: vars.variantNeutralWeak.selectedLoading.root.color,
        },

        ...prefixIcon({
          color: vars.variantNeutralWeak.rest.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantNeutralWeak.rest.suffixIcon.color,
        }),
      },
    },
    size: {
      xsmall: {
        height: vars.sizeXsmall.rest.root.minHeight,
        borderRadius: vars.sizeXsmall.rest.root.cornerRadius,
        gap: vars.sizeXsmall.rest.root.gap,
        paddingInline: vars.sizeXsmall.rest.root.paddingX,
        paddingBlock: vars.sizeXsmall.rest.root.paddingY,
        fontSize: vars.sizeXsmall.rest.label.fontSize,
        lineHeight: vars.sizeXsmall.rest.label.lineHeight,

        "--size": vars.sizeXsmall.rest.progressCircle.size,
        "--thickness": vars.sizeXsmall.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeXsmall.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeXsmall.rest.suffixIcon.size,
        }),
      },
      small: {
        height: vars.sizeSmall.rest.root.minHeight,
        borderRadius: vars.sizeSmall.rest.root.cornerRadius,
        gap: vars.sizeSmall.rest.root.gap,
        paddingInline: vars.sizeSmall.rest.root.paddingX,
        paddingBlock: vars.sizeSmall.rest.root.paddingY,
        fontSize: vars.sizeSmall.rest.label.fontSize,
        lineHeight: vars.sizeSmall.rest.label.lineHeight,

        "--size": vars.sizeSmall.rest.progressCircle.size,
        "--thickness": vars.sizeSmall.rest.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeSmall.rest.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeSmall.rest.suffixIcon.size,
        }),
      },
    },
  },
  defaultVariants: {
    variant: "brandSolid",
    size: "small",
  },
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
    },
  },
});

export default toggleButton;

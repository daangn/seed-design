import { toggleButton as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { prefixIcon, suffixIcon } from "../utils/icon";
import { active, disabled, focus, loading, pressed, pseudo } from "../utils/pseudo";

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

    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    fontWeight: vars.base.enabled.label.fontWeight,
  },
  variants: {
    variant: {
      brandSolid: {
        background: vars.variantBrandSolid.enabled.root.color,
        color: vars.variantBrandSolid.enabled.label.color,

        "--track-color": vars.variantBrandSolid.enabled.progressCircle.trackColor,
        "--range-color": vars.variantBrandSolid.enabled.progressCircle.rangeColor,

        [pseudo(active)]: {
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
        [pseudo(pressed, active)]: {
          background: vars.variantBrandSolid.selectedPressed.root.color,
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
          color: vars.variantBrandSolid.enabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantBrandSolid.enabled.suffixIcon.color,
        }),
      },
      neutralWeak: {
        background: vars.variantNeutralWeak.enabled.root.color,
        color: vars.variantNeutralWeak.enabled.label.color,

        "--track-color": vars.variantNeutralWeak.enabled.progressCircle.trackColor,
        "--range-color": vars.variantNeutralWeak.enabled.progressCircle.rangeColor,

        [pseudo(active)]: {
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
        [pseudo(pressed, active)]: {
          background: vars.variantNeutralWeak.selectedPressed.root.color,
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
          color: vars.variantNeutralWeak.enabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.variantNeutralWeak.enabled.suffixIcon.color,
        }),
      },
    },
    size: {
      xsmall: {
        height: vars.sizeXsmall.enabled.root.minHeight,
        borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,
        gap: vars.sizeXsmall.enabled.root.gap,
        paddingLeft: vars.sizeXsmall.enabled.root.paddingX,
        paddingRight: vars.sizeXsmall.enabled.root.paddingX,
        paddingTop: vars.sizeXsmall.enabled.root.paddingY,
        paddingBottom: vars.sizeXsmall.enabled.root.paddingY,
        fontSize: vars.sizeXsmall.enabled.label.fontSize,
        lineHeight: vars.sizeXsmall.enabled.label.lineHeight,

        "--size": vars.sizeXsmall.enabled.progressCircle.size,
        "--thickness": vars.sizeXsmall.enabled.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeXsmall.enabled.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeXsmall.enabled.suffixIcon.size,
        }),
      },
      small: {
        height: vars.sizeSmall.enabled.root.minHeight,
        borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
        gap: vars.sizeSmall.enabled.root.gap,
        paddingLeft: vars.sizeSmall.enabled.root.paddingX,
        paddingRight: vars.sizeSmall.enabled.root.paddingX,
        paddingTop: vars.sizeSmall.enabled.root.paddingY,
        paddingBottom: vars.sizeSmall.enabled.root.paddingY,
        fontSize: vars.sizeSmall.enabled.label.fontSize,
        lineHeight: vars.sizeSmall.enabled.label.lineHeight,

        "--size": vars.sizeSmall.enabled.progressCircle.size,
        "--thickness": vars.sizeSmall.enabled.progressCircle.thickness,

        ...prefixIcon({
          size: vars.sizeSmall.enabled.prefixIcon.size,
        }),
        ...suffixIcon({
          size: vars.sizeSmall.enabled.suffixIcon.size,
        }),
      },
    },
  },
  defaultVariants: {
    variant: "brandSolid",
    size: "small",
  },
});

export default toggleButton;

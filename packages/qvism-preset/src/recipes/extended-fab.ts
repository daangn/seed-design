import { extendedFab as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { active, disabled, focus, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";

/**
 * @deprecated Use `contextual-floating-button` instead.
 */
const extendedFab = defineRecipe({
  name: "extended-fab",
  base: {
    display: "inline-flex",
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

    borderRadius: vars.base.rest.root.cornerRadius,
    boxShadow: vars.base.rest.root.shadow,
  },
  variants: {
    variant: {
      neutralSolid: {
        background: vars.variantNeutralSolid.rest.root.color,
        color: vars.variantNeutralSolid.rest.label.color,

        [pseudo(active)]: {
          background: vars.variantNeutralSolid.pressed.root.color,
        },

        ...prefixIcon({
          color: vars.variantNeutralSolid.rest.prefixIcon.color,
        }),
      },
      layerFloating: {
        background: vars.variantLayerFloating.rest.root.color,
        color: vars.variantLayerFloating.rest.label.color,

        [pseudo(active)]: {
          background: vars.variantLayerFloating.pressed.root.color,
        },

        ...prefixIcon({
          color: vars.variantLayerFloating.rest.prefixIcon.color,
        }),
      },
    },
    size: {
      small: {
        paddingInline: vars.sizeSmall.rest.root.paddingX,
        paddingBlock: vars.sizeSmall.rest.root.paddingY,
        minHeight: vars.sizeSmall.rest.root.minHeight,
        gap: vars.sizeSmall.rest.root.gap,

        fontSize: vars.sizeSmall.rest.label.fontSize,
        lineHeight: vars.sizeSmall.rest.label.lineHeight,
        fontWeight: vars.sizeSmall.rest.label.fontWeight,

        ...prefixIcon({
          size: vars.sizeSmall.rest.prefixIcon.size,
        }),
      },
      medium: {
        paddingInline: vars.sizeMedium.rest.root.paddingX,
        paddingBlock: vars.sizeMedium.rest.root.paddingY,
        minHeight: vars.sizeMedium.rest.root.minHeight,
        gap: vars.sizeMedium.rest.root.gap,

        fontSize: vars.sizeMedium.rest.label.fontSize,
        lineHeight: vars.sizeMedium.rest.label.lineHeight,
        fontWeight: vars.sizeMedium.rest.label.fontWeight,

        ...prefixIcon({
          size: vars.sizeMedium.rest.prefixIcon.size,
        }),
      },
    },
  },
  defaultVariants: {
    variant: "neutralSolid",
    size: "medium",
  },
});

export default extendedFab;

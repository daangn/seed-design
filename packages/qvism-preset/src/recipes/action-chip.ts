import { actionChip as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { active, disabled, focus, pseudo } from "../utils/pseudo";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { count } from "../utils/count";

/**
 * @deprecated Use `chip` instead.
 */
const actionChip = defineRecipe({
  name: "action-chip",
  base: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    border: "none",
    textTransform: "none",
    textAlign: "start",
    whiteSpace: "nowrap",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    flexShrink: 0,
    fontFamily: "inherit",
    lineHeight: 1,

    fontWeight: vars.base.enabled.label.fontWeight,
    borderRadius: vars.base.enabled.root.cornerRadius,

    background: vars.base.enabled.root.color,
    color: vars.base.enabled.label.color,

    ...prefixIcon({ color: vars.base.enabled.prefixIcon.color }),
    ...suffixIcon({ color: vars.base.enabled.suffixIcon.color }),
    ...onlyIcon({ color: vars.base.enabled.icon.color }),
    ...count({
      fontWeight: vars.base.enabled.count.fontWeight,
      color: vars.base.enabled.count.color,
    }),

    [pseudo(active)]: {
      background: vars.base.pressed.root.color,
    },
    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(disabled)]: {
      background: vars.base.disabled.root.color,
      color: vars.base.disabled.label.color,
      cursor: "not-allowed",
      ...prefixIcon({ color: vars.base.disabled.prefixIcon.color }),
      ...suffixIcon({ color: vars.base.disabled.suffixIcon.color }),
      ...onlyIcon({ color: vars.base.disabled.icon.color }),
    },
  },
  variants: {
    size: {
      medium: {
        minHeight: vars.sizeMedium.enabled.root.minHeight,
        paddingBlock: vars.sizeMedium.enabled.root.paddingY,
        gap: vars.sizeMedium.enabled.root.gap,
        fontSize: vars.sizeMedium.enabled.label.fontSize,
        lineHeight: vars.sizeMedium.enabled.label.lineHeight,

        ...count({
          fontSize: vars.sizeMedium.enabled.count.fontSize,
        }),
        ...prefixIcon({ size: vars.sizeMedium.enabled.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeMedium.enabled.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeMediumLayoutIconOnly.enabled.icon.size }),
      },
      small: {
        minHeight: vars.sizeSmall.enabled.root.minHeight,
        paddingBlock: vars.sizeSmall.enabled.root.paddingY,
        gap: vars.sizeSmall.enabled.root.gap,
        fontSize: vars.sizeSmall.enabled.label.fontSize,
        lineHeight: vars.sizeSmall.enabled.label.lineHeight,

        ...count({
          fontSize: vars.sizeSmall.enabled.count.fontSize,
        }),
        ...prefixIcon({ size: vars.sizeSmall.enabled.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeSmall.enabled.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeSmallLayoutIconOnly.enabled.icon.size }),
      },
    },
    layout: {
      withText: {},
      iconOnly: {},
    },
  },
  compoundVariants: [
    {
      size: "medium",
      layout: "withText",
      css: {
        paddingInline: vars.sizeMediumLayoutWithText.enabled.root.paddingX,
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        paddingInline: vars.sizeSmallLayoutWithText.enabled.root.paddingX,
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    layout: "withText",
  },
});

export default actionChip;

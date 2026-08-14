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

    fontWeight: vars.base.rest.label.fontWeight,
    borderRadius: vars.base.rest.root.cornerRadius,

    background: vars.base.rest.root.color,
    color: vars.base.rest.label.color,

    ...prefixIcon({ color: vars.base.rest.prefixIcon.color }),
    ...suffixIcon({ color: vars.base.rest.suffixIcon.color }),
    ...onlyIcon({ color: vars.base.rest.icon.color }),
    ...count({
      fontWeight: vars.base.rest.count.fontWeight,
      color: vars.base.rest.count.color,
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
        minHeight: vars.sizeMedium.rest.root.minHeight,
        paddingBlock: vars.sizeMedium.rest.root.paddingY,
        gap: vars.sizeMedium.rest.root.gap,
        fontSize: vars.sizeMedium.rest.label.fontSize,
        lineHeight: vars.sizeMedium.rest.label.lineHeight,

        ...count({
          fontSize: vars.sizeMedium.rest.count.fontSize,
        }),
        ...prefixIcon({ size: vars.sizeMedium.rest.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeMedium.rest.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeMediumLayoutIconOnly.rest.icon.size }),
      },
      small: {
        minHeight: vars.sizeSmall.rest.root.minHeight,
        paddingBlock: vars.sizeSmall.rest.root.paddingY,
        gap: vars.sizeSmall.rest.root.gap,
        fontSize: vars.sizeSmall.rest.label.fontSize,
        lineHeight: vars.sizeSmall.rest.label.lineHeight,

        ...count({
          fontSize: vars.sizeSmall.rest.count.fontSize,
        }),
        ...prefixIcon({ size: vars.sizeSmall.rest.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeSmall.rest.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeSmallLayoutIconOnly.rest.icon.size }),
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
        paddingInline: vars.sizeMediumLayoutWithText.rest.root.paddingX,
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeMediumLayoutIconOnly.rest.root.minWidth,
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        paddingInline: vars.sizeSmallLayoutWithText.rest.root.paddingX,
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        minWidth: vars.sizeSmallLayoutIconOnly.rest.root.minWidth,
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    layout: "withText",
  },
});

export default actionChip;

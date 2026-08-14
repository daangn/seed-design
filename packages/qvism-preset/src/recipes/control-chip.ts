import { controlChip as vars } from "../vars/component";

import { count } from "../utils/count";
import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { active, checked, disabled, focus, pseudo } from "../utils/pseudo";

/**
 * @deprecated Use `chip` instead.
 */
const controlChip = defineRecipe({
  name: "control-chip",
  base: {
    position: "relative",
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
    lineHeight: 1,

    borderRadius: vars.base.rest.root.cornerRadius,
    boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

    color: vars.base.rest.label.color,
    fontWeight: vars.base.rest.label.fontWeight,

    // Icon styles
    ...prefixIcon({ color: vars.base.rest.prefixIcon.color }),
    ...suffixIcon({ color: vars.base.rest.suffixIcon.color }),
    ...onlyIcon({ color: vars.base.rest.icon.color }),

    ...count({
      fontWeight: vars.base.rest.count.fontWeight,
      color: vars.base.rest.count.color,
    }),

    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(active)]: {
      background: vars.base.pressed.root.color,
    },
    [pseudo(checked)]: {
      boxShadow: "none",
      background: vars.base.selected.root.color,
      color: vars.base.selected.label.color,
      fontWeight: vars.base.selected.label.fontWeight,
      ...prefixIcon({ color: vars.base.selected.prefixIcon.color }),
      ...suffixIcon({ color: vars.base.selected.suffixIcon.color }),
      ...onlyIcon({ color: vars.base.selected.icon.color }),
      ...count({ color: vars.base.selected.count.color }),
    },
    [pseudo(checked, active)]: {
      background: vars.base.pressedSelected.root.color,
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
      background: vars.base.disabled.root.color,
      color: vars.base.disabled.label.color,
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

        ...prefixIcon({ size: vars.sizeMedium.rest.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeMedium.rest.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeMediumLayoutIconOnly.rest.icon.size }),
        ...count({
          fontSize: vars.sizeMedium.rest.count.fontSize,
        }),
      },
      small: {
        minHeight: vars.sizeSmall.rest.root.minHeight,
        paddingBlock: vars.sizeSmall.rest.root.paddingY,
        gap: vars.sizeSmall.rest.root.gap,
        fontSize: vars.sizeSmall.rest.label.fontSize,
        lineHeight: vars.sizeSmall.rest.label.lineHeight,

        ...prefixIcon({ size: vars.sizeSmall.rest.prefixIcon.size }),
        ...suffixIcon({ size: vars.sizeSmall.rest.suffixIcon.size }),
        ...onlyIcon({ size: vars.sizeSmallLayoutIconOnly.rest.icon.size }),
        ...count({
          fontSize: vars.sizeSmall.rest.count.fontSize,
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

export default controlChip;

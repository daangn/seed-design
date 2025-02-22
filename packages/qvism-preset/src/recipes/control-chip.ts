import { controlChip as vars } from "@seed-design/css/vars/component";

import { count } from "../utils/count";
import { defineRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { active, checked, disabled, focus, pseudo } from "../utils/pseudo";

const controlChip = defineRecipe({
  name: "control-chip",
  slots: ["root"],
  base: {
    root: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      flexShrink: 0,
      lineHeight: 1,

      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,

      // Icon styles
      ...prefixIcon({ color: vars.base.enabled.prefixIcon.color }),
      ...suffixIcon({ color: vars.base.enabled.suffixIcon.color }),
      ...onlyIcon({ color: vars.base.enabled.icon.color }),

      ...count({
        lineHeight: 1,
        fontWeight: vars.base.enabled.count.fontWeight,
        color: vars.base.enabled.count.color,
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
        background: vars.base.selectedPressed.root.color,
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
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,
          gap: vars.sizeMedium.enabled.root.gap,
          fontSize: vars.sizeMedium.enabled.label.fontSize,

          ...prefixIcon({ size: vars.sizeMedium.enabled.prefixIcon.size }),
          ...suffixIcon({ size: vars.sizeMedium.enabled.suffixIcon.size }),
          ...onlyIcon({ size: vars.sizeMediumLayoutIconOnly.enabled.icon.size }),
          ...count({
            fontSize: vars.sizeMedium.enabled.count.fontSize,
          }),
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          paddingBlock: vars.sizeSmall.enabled.root.paddingY,
          gap: vars.sizeSmall.enabled.root.gap,
          fontSize: vars.sizeSmall.enabled.label.fontSize,

          ...prefixIcon({ size: vars.sizeSmall.enabled.prefixIcon.size }),
          ...suffixIcon({ size: vars.sizeSmall.enabled.suffixIcon.size }),
          ...onlyIcon({ size: vars.sizeSmallLayoutIconOnly.enabled.icon.size }),
          ...count({
            fontSize: vars.sizeSmall.enabled.count.fontSize,
          }),
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
      size: "medium",
      layout: "withText",
      css: {
        root: {
          paddingInline: vars.sizeMediumLayoutWithText.enabled.root.paddingX,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
        },
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        root: {
          paddingInline: vars.sizeSmallLayoutWithText.enabled.root.paddingX,
        },
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
        },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    layout: "withText",
  },
});

export default controlChip;

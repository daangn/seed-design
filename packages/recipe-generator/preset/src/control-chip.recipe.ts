import { rem } from "@seed-design/recipe-generator-core";

import { vars } from "./__generated__/control-chip.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, focus, pseudo } from "./pseudo";

const controlChip = defineRecipe({
  name: "controlChip",
  slots: ["root", "label", "icon", "prefixIcon", "suffixIcon", "count"],
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

      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(active)]: {
        background: vars.base.pressed.root.color,
      },
      [pseudo(checked)]: {
        background: vars.base.selected.root.color,
        boxShadow: "none",
      },
      [pseudo(checked, active)]: {
        background: vars.base.selectedPressed.root.color,
      },
      [pseudo(disabled)]: {
        background: vars.base.disabled.root.color,
        cursor: "not-allowed",
      },
    },
    label: {
      lineHeight: 1,

      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
      [pseudo(checked)]: {
        color: vars.base.selected.label.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
    prefixIcon: {
      display: "inline-flex",

      color: vars.base.enabled.prefixIcon.color,
      [pseudo(checked)]: {
        color: vars.base.selected.prefixIcon.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixIcon: {
      display: "inline-flex",

      color: vars.base.enabled.suffixIcon.color,
      [pseudo(checked)]: {
        color: vars.base.selected.suffixIcon.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixIcon.color,
      },
    },
    icon: {
      display: "inline-flex",

      color: vars.base.enabled.icon.color,
      [pseudo(checked)]: {
        color: vars.base.selected.icon.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.icon.color,
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
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
        },
        prefixIcon: {
          width: rem(vars.sizeMedium.enabled.prefixIcon.size),
          height: rem(vars.sizeMedium.enabled.prefixIcon.size),
        },
        suffixIcon: {
          width: rem(vars.sizeMedium.enabled.suffixIcon.size),
          height: rem(vars.sizeMedium.enabled.suffixIcon.size),
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          paddingBlock: vars.sizeSmall.enabled.root.paddingY,
          gap: vars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
        },
        prefixIcon: {
          width: rem(vars.sizeSmall.enabled.prefixIcon.size),
          height: rem(vars.sizeSmall.enabled.prefixIcon.size),
        },
        suffixIcon: {
          width: rem(vars.sizeSmall.enabled.suffixIcon.size),
          height: rem(vars.sizeSmall.enabled.suffixIcon.size),
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
        icon: {
          width: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
          height: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
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
        icon: {
          width: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
          height: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
        },
      },
    },
  ],
});

export default controlChip;

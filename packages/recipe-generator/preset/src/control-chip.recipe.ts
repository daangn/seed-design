import { rem } from "@seed-design/recipe-generator-core";

import { vars } from "./__generated__/control-chip.vars";
import { defineRecipe } from "./helper";
import { active, checked, disabled, focus, pseudo } from "./pseudo";

const controlChip = defineRecipe({
  name: "controlChip",
  slots: ["root", "label", "icon", "prefix", "suffix", "count"],
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
      borderStyle: "solid",
      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,

      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(active)]: {
        background: vars.base.pressed.root.color,
      },
      [pseudo(checked)]: {
        background: vars.base.selected.root.color,
        borderWidth: vars.base.selected.root.strokeWidth as 0,
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
    prefix: {
      display: "inline-flex",

      color: vars.base.enabled.prefix.color,
      [pseudo(checked)]: {
        color: vars.base.selected.prefix.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.prefix.color,
      },
    },
    suffix: {
      display: "inline-flex",

      color: vars.base.enabled.suffix.color,
      [pseudo(checked)]: {
        color: vars.base.selected.suffix.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.suffix.color,
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
        prefix: {
          width: rem(vars.sizeMedium.enabled.prefix.size),
          height: rem(vars.sizeMedium.enabled.prefix.size),
        },
        suffix: {
          width: rem(vars.sizeMedium.enabled.suffix.size),
          height: rem(vars.sizeMedium.enabled.suffix.size),
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
        prefix: {
          width: rem(vars.sizeSmall.enabled.prefix.size),
          height: rem(vars.sizeSmall.enabled.prefix.size),
        },
        suffix: {
          width: rem(vars.sizeSmall.enabled.suffix.size),
          height: rem(vars.sizeSmall.enabled.suffix.size),
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

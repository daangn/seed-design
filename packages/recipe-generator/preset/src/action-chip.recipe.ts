import { rem } from "@seed-design/recipe-generator-core";

import { defineRecipe } from "./helper";
import { active, disabled, focus, pseudo } from "./pseudo";
import { vars } from "./__generated__/action-chip.vars";

const actionChip = defineRecipe({
  name: "actionChip",
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

      borderRadius: vars.base.enabled.root.borderRadius,
      [pseudo(focus)]: {
        outline: "none",
      },

      background: vars.base.enabled.root.color,
      [pseudo(active)]: {
        background: vars.base.pressed.root.color,
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
      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
    prefix: {
      display: "inline-flex",

      color: vars.base.enabled.prefix.color,
      [pseudo(disabled)]: {
        color: vars.base.disabled.prefix.color,
      },
    },
    suffix: {
      display: "inline-flex",

      color: vars.base.enabled.suffix.color,
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
      text: {},
      iconOnly: {},
    },
  },
  compoundVariants: [
    {
      size: "medium",
      layout: "text",
      css: {
        root: {
          paddingInline: vars.sizeMediumLayoutText.enabled.root.paddingX,
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
      layout: "text",
      css: {
        root: {
          paddingInline: vars.sizeSmallLayoutText.enabled.root.paddingX,
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

export default actionChip;

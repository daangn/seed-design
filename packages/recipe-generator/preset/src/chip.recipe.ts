import { rem } from "@seed-design/recipe-generator-core";

import { defineRecipe } from "./helper";
import { active, disabled, focus, pseudo } from "./pseudo";
import { vars } from "./__generated__/chip.vars";

const chip = defineRecipe({
  name: "chip",
  slots: ["root", "label", "prefix", "suffix", "count"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      borderRadius: vars.base.enabled.root.borderRadius,
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
      [pseudo(focus)]: {
        outline: "none",
      },
    },
    prefix: {
      display: "inline-flex",
    },
    suffix: {
      display: "inline-flex",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          padding: `${vars.sizeMedium.enabled.root.paddingY} ${vars.sizeMedium.enabled.root.paddingX}`,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          fontWeight: vars.sizeMedium.enabled.label.fontWeight,
        },
        count: {
          fontSize: vars.sizeMedium.enabled.count.fontSize,
          fontWeight: vars.sizeMedium.enabled.count.fontWeight,
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
          padding: `${vars.sizeSmall.enabled.root.paddingY} ${vars.sizeSmall.enabled.root.paddingX}`,
          gap: vars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          fontWeight: vars.sizeSmall.enabled.label.fontWeight,
        },
        count: {
          fontSize: vars.sizeSmall.enabled.count.fontSize,
          fontWeight: vars.sizeSmall.enabled.count.fontWeight,
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
    variant: {
      default: {
        root: {
          background: "none",
          boxShadow: `0 0 0 1px ${vars.variantDefault.enabled.root.strokeColor} inset`,
          [pseudo(active)]: {
            background: vars.variantDefault.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: "none",
          },
        },
        label: {
          color: vars.variantDefault.enabled.label.color,
          [pseudo(disabled)]: {
            color: vars.variantDefault.disabled.label.color,
          },
        },
        prefix: {
          color: vars.variantDefault.enabled.prefix.color,
          [pseudo(disabled)]: {
            color: vars.variantDefault.disabled.prefix.color,
          },
        },
        suffix: {
          color: vars.variantDefault.enabled.suffix.color,
          [pseudo(disabled)]: {
            color: vars.variantDefault.disabled.suffix.color,
          },
        },
        count: {
          color: vars.variantDefault.enabled.count.color,
          [pseudo(disabled)]: {
            color: vars.variantDefault.disabled.count.color,
          },
        },
      },
      inverted: {
        root: {
          background: vars.variantInverted.enabled.root.color,
          [pseudo(active)]: {
            background: vars.variantInverted.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantInverted.disabled.root.color,
          },
        },
        label: {
          color: vars.variantInverted.enabled.label.color,
        },
        prefix: {
          color: vars.variantInverted.enabled.prefix.color,
        },
        suffix: {
          color: vars.variantInverted.enabled.suffix.color,
        },
        count: {
          color: vars.variantInverted.enabled.count.color,
        },
      },
    },
  },
});

export default chip;

import { rem } from "@seed-design/recipe-generator-core";

import { defineRecipe } from "./helper";
import { active, disabled, focus, pseudo } from "./pseudo";
import { vars } from "./__generated__/action-chip.vars";

const actionChip = defineRecipe({
  name: "actionChip",
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
      color: vars.base.enabled.label.color,
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
          padding: `${vars.sizeMedium.enabled.root.paddingY} ${vars.sizeMedium.enabled.root.paddingX}`,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          fontWeight: vars.sizeMedium.enabled.label.fontWeight,
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
  },
});

export default actionChip;

import { switchMark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { checked, disabled, pseudo } from "../utils/pseudo";

const switchMarkRecipe = defineSlotRecipe({
  name: "switch-mark",
  slots: ["root", "thumb"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "block",
      position: "relative",

      borderRadius: vars.base.enabled.root.cornerRadius,
      background: vars.base.enabled.root.color,

      margin: "var(--switch-mark-margin-top, 0) 0", // 수직 위치 보정

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.root.opacity,
      },
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneNeutral.enabledSelected.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.toneNeutral.disabled.root.color,
          },
        },
        thumb: {
          background: vars.toneNeutral.enabled.thumb.color,

          [pseudo(disabled)]: {
            background: vars.toneNeutral.disabled.thumb.color,
          },
        },
      },
      brand: {
        root: {
          [pseudo(checked)]: {
            background: vars.toneBrand.enabledSelected.root.color,
          },
        },
        thumb: {
          background: vars.toneBrand.enabled.thumb.color,
        },
      },
    },
    size: {
      32: {
        root: {
          minInlineSize: vars.size32.enabled.root.width,
          minBlockSize: vars.size32.enabled.root.height,
          padding: `${vars.size32.enabled.root.paddingY} ${vars.size32.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size32.enabled.thumb.width,
          height: vars.size32.enabled.thumb.height,
          boxShadow: vars.size32.enabled.thumb.shadow,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size32.enabled.root.width} - ${vars.size32.enabled.root.height}))`,
          },
        },
      },
      24: {
        root: {
          minInlineSize: vars.size24.enabled.root.width,
          minBlockSize: vars.size24.enabled.root.height,
          padding: `${vars.size24.enabled.root.paddingY} ${vars.size24.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size24.enabled.thumb.width,
          height: vars.size24.enabled.thumb.height,
          boxShadow: vars.size24.enabled.thumb.shadow,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size24.enabled.root.width} - ${vars.size24.enabled.root.height}))`,
          },
        },
      },
      16: {
        root: {
          minInlineSize: vars.size16.enabled.root.width,
          minBlockSize: vars.size16.enabled.root.height,
          padding: `${vars.size16.enabled.root.paddingY} ${vars.size16.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size16.enabled.thumb.width,
          height: vars.size16.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size16.enabled.root.width} - ${vars.size16.enabled.root.height}))`,
          },
        },
      },
    },
  },
  defaultVariants: {
    tone: "brand",
    size: 32,
  },
});

export default switchMarkRecipe;

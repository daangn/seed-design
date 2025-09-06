import { switch as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { checked, disabled, pseudo } from "../utils/pseudo";

const switchRecipe = defineSlotRecipe({
  name: "switch",
  slots: ["root", "control", "thumb", "label"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "flex-start",
      justifyContent: "space-between",

      position: "relative",

      verticalAlign: "top",
      isolation: "isolate",
      cursor: "pointer",

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    control: {
      boxSizing: "border-box",
      display: "block",
      position: "relative",

      borderRadius: vars.base.enabled.control.cornerRadius,
      background: vars.base.enabled.control.color,

      transition: "background-color 50ms cubic-bezier(0.35, 0, 0.35, 1) 20ms",

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.control.opacity,
      },
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,
      background: vars.base.enabled.thumb.color,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",
    },
    label: {
      fontWeight: vars.base.enabled.label.fontWeight,
      color: vars.base.enabled.label.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
  },
  variants: {
    tone: {
      neutral: {
        control: {
          [pseudo(checked)]: {
            background: vars.toneNeutral.enabledSelected.control.color,
          },
        },
      },
      brand: {
        control: {
          [pseudo(checked)]: {
            background: vars.toneBrand.enabledSelected.control.color,
          },
        },
      },
    },
    size: {
      32: {
        root: {
          minHeight: vars.size32.enabled.root.height,
          gap: vars.size32.enabled.root.gap,
        },
        control: {
          minInlineSize: vars.size32.enabled.control.width,
          minBlockSize: vars.size32.enabled.control.height,
          padding: `${vars.size32.enabled.control.paddingY} ${vars.size32.enabled.control.paddingX}`,
          margin: `calc((${vars.size32.enabled.root.height} - ${vars.size32.enabled.control.height}) / 2) 0`, // 수직 위치 보정
        },
        thumb: {
          width: vars.size32.enabled.thumb.width,
          height: vars.size32.enabled.thumb.height,
          boxShadow: vars.size32.enabled.thumb.shadow,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size32.enabled.control.width} - ${vars.size32.enabled.control.height}))`,
          },
        },
        label: {
          fontSize: vars.size32.enabled.label.fontSize,
          lineHeight: vars.size32.enabled.label.lineHeight,
          marginTop: "calc(16px - 0.6875rem)", // 수직 위치 보정, 32 / 2 - label.lineHeight / 2
        },
      },
      24: {
        root: {
          minHeight: vars.size24.enabled.root.height,
          gap: vars.size24.enabled.root.gap,
        },
        control: {
          minInlineSize: vars.size24.enabled.control.width,
          minBlockSize: vars.size24.enabled.control.height,
          padding: `${vars.size24.enabled.control.paddingY} ${vars.size24.enabled.control.paddingX}`,
          margin: `calc((${vars.size24.enabled.root.height} - ${vars.size24.enabled.control.height}) / 2) 0`, // 수직 위치 보정
        },
        thumb: {
          width: vars.size24.enabled.thumb.width,
          height: vars.size24.enabled.thumb.height,
          boxShadow: vars.size24.enabled.thumb.shadow,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size24.enabled.control.width} - ${vars.size24.enabled.control.height}))`,
          },
        },
        label: {
          fontSize: vars.size24.enabled.label.fontSize,
          lineHeight: vars.size24.enabled.label.lineHeight,
          marginTop: "calc(12px - 0.59375rem)", // 수직 위치 보정, 24 / 2 - label.lineHeight / 2
        },
      },
      16: {
        root: {
          minHeight: vars.size16.enabled.root.height,
          gap: vars.size16.enabled.root.gap,
        },
        control: {
          minInlineSize: vars.size16.enabled.control.width,
          minBlockSize: vars.size16.enabled.control.height,
          padding: `${vars.size16.enabled.control.paddingY} ${vars.size16.enabled.control.paddingX}`,
          margin: `calc((${vars.size16.enabled.root.height} - ${vars.size16.enabled.control.height}) / 2) 0`, // 수직 위치 보정
        },
        thumb: {
          width: vars.size16.enabled.thumb.width,
          height: vars.size16.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.size16.enabled.control.width} - ${vars.size16.enabled.control.height}))`,
          },
        },
        label: {
          fontSize: vars.size16.enabled.label.fontSize,
          lineHeight: vars.size16.enabled.label.lineHeight,
          marginTop: "calc(12px - 0.5625rem)", // 수직 위치 보정, 24 / 2 - label.lineHeight / 2
        },
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: 32,
  },
});

export default switchRecipe;

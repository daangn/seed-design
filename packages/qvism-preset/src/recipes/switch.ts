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
      opacity: 1,
      cursor: "pointer",

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.root.opacity,
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

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.control.color,
      },
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,
      background: vars.base.enabled.thumb.color,

      transition: "transform 150ms cubic-bezier(0.35, 0, 0.35, 1)",
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.height,
        },
        control: {
          minInlineSize: vars.sizeMedium.enabled.control.width,
          minBlockSize: vars.sizeMedium.enabled.control.height,
          padding: `${vars.sizeMedium.enabled.control.paddingY} ${vars.sizeMedium.enabled.control.paddingX}`,
        },
        thumb: {
          width: vars.sizeMedium.enabled.thumb.width,
          height: vars.sizeMedium.enabled.thumb.height,
          boxShadow: vars.sizeMedium.enabled.thumb.shadow,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.sizeMedium.enabled.control.width} - ${vars.sizeMedium.enabled.control.height}))`,
          },
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.height,
          gap: vars.sizeSmall.enabled.root.gap,
        },
        control: {
          minInlineSize: vars.sizeSmall.enabled.control.width,
          minBlockSize: vars.sizeSmall.enabled.control.height,
          padding: `${vars.sizeSmall.enabled.control.paddingY} ${vars.sizeSmall.enabled.control.paddingX}`,
          margin: `calc((${vars.sizeSmall.enabled.root.height} - ${vars.sizeSmall.enabled.control.height}) / 2) 0`, // 수직 위치 보정
        },
        thumb: {
          width: vars.sizeSmall.enabled.thumb.width,
          height: vars.sizeSmall.enabled.thumb.height,

          [pseudo(checked)]: {
            transform: `translateX(calc(${vars.sizeSmall.enabled.control.width} - ${vars.sizeSmall.enabled.control.height}))`,
          },
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
          fontWeight: vars.sizeSmall.enabled.label.fontWeight,
          marginTop: "calc(12px - 0.59375rem)", // 수직 위치 보정, 24 / 2 - label.lineHeight / 2
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default switchRecipe;

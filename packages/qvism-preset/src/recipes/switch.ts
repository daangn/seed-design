import { switch as vars } from "../vars/component";
import { switchmark as markVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { disabled, pseudo } from "../utils/pseudo";

const switchRecipe = defineSlotRecipe({
  name: "switch",
  slots: ["root", "label"],
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
    label: {
      fontWeight: vars.base.enabled.label.fontWeight,
      color: vars.base.enabled.label.color,

      transition: `opacity ${vars.base.disabled.label.opacityDuration} ${vars.base.disabled.label.opacityTimingFunction}`,

      [pseudo(disabled)]: {
        opacity: vars.base.disabled.label.opacity,
      },
    },
  },
  variants: {
    size: {
      32: {
        root: {
          minHeight: vars.size32.enabled.root.height,
          gap: vars.size32.enabled.root.gap,

          "--switchmark-margin-top": `calc((${vars.size32.enabled.root.height} - ${markVars.size32.enabled.root.height}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.size32.enabled.label.fontSize,
          lineHeight: vars.size32.enabled.label.lineHeight,
          marginTop: `calc(${vars.size32.enabled.root.height} / 2 - ${vars.size32.enabled.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
      24: {
        root: {
          minHeight: vars.size24.enabled.root.height,
          gap: vars.size24.enabled.root.gap,

          "--switchmark-margin-top": `calc((${vars.size24.enabled.root.height} - ${markVars.size24.enabled.root.height}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.size24.enabled.label.fontSize,
          lineHeight: vars.size24.enabled.label.lineHeight,
          marginTop: `calc(${vars.size24.enabled.root.height} / 2 - ${vars.size24.enabled.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
      16: {
        root: {
          minHeight: vars.size16.enabled.root.height,
          gap: vars.size16.enabled.root.gap,

          "--switchmark-margin-top": `calc((${vars.size16.enabled.root.height} - ${markVars.size16.enabled.root.height}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.size16.enabled.label.fontSize,
          lineHeight: vars.size16.enabled.label.lineHeight,
          marginTop: `calc(${vars.size16.enabled.root.height} / 2 - ${vars.size16.enabled.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
    },
  },
  defaultVariants: {
    size: 32,
  },
});

export default switchRecipe;

import { defineSlotRecipe } from "../utils/define";
import { disabled, pseudo } from "../utils/pseudo";
import { radio as vars, radiomark as radiomarkVars } from "../vars/component";

const radio = defineSlotRecipe({
  name: "radio",
  slots: ["root", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      position: "relative",
      maxInlineSize: "100%",
      verticalAlign: "top",
      isolation: "isolate",
      cursor: "pointer",

      gap: vars.base.enabled.root.gap,

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    label: {
      color: vars.base.enabled.label.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
  },
  variants: {
    weight: {
      default: {
        label: {
          fontWeight: vars.weightDefault.enabled.label.fontWeight,
        },
      },
      stronger: {
        label: {
          fontWeight: vars.weightStronger.enabled.label.fontWeight,
        },
      },
    },
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeLarge.enabled.root.minHeight} - ${radiomarkVars.sizeLarge.enabled.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
          marginBlockStart: "calc(18px - 0.65625rem)", // 수직 위치 보정, 36 / 2 - label.lineHeight / 2
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeMedium.enabled.root.minHeight} - ${radiomarkVars.sizeMedium.enabled.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
          marginBlockStart: "calc(16px - 0.59375rem)", // 수직 위치 보정, 32 / 2 - label.lineHeight / 2
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    weight: "default",
  },
});

export default radio;

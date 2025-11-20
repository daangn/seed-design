import { defineSlotRecipe } from "../utils/define";
import { disabled, pseudo } from "../utils/pseudo";
import { checkmark as checkmarkVars, checkbox as vars } from "../vars/component";

const checkbox = defineSlotRecipe({
  name: "checkbox",
  slots: ["root", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      position: "relative",
      maxWidth: "100%",
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
      regular: {
        label: {
          fontWeight: vars.weightRegular.enabled.label.fontWeight,
        },
      },
      bold: {
        label: {
          fontWeight: vars.weightBold.enabled.label.fontWeight,
        },
      },
    },
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          "--checkmark-margin-top": `calc((${vars.sizeLarge.enabled.root.minHeight} - ${checkmarkVars.sizeLarge.enabled.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,

          marginTop: `calc(${vars.sizeLarge.enabled.root.minHeight} / 2 - ${vars.sizeLarge.enabled.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          "--checkmark-margin-top": `calc((${vars.sizeMedium.enabled.root.minHeight} - ${checkmarkVars.sizeMedium.enabled.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,

          marginTop: `calc(${vars.sizeMedium.enabled.root.minHeight} / 2 - ${vars.sizeMedium.enabled.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    weight: "regular",
  },
});

export default checkbox;

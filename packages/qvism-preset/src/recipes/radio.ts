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
      maxWidth: "100%",
      verticalAlign: "top",
      isolation: "isolate",
      cursor: "pointer",

      gap: vars.base.rest.root.gap,

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    label: {
      color: vars.base.rest.label.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
  },
  variants: {
    weight: {
      regular: {
        label: {
          fontWeight: vars.weightRegular.rest.label.fontWeight,
        },
      },
      bold: {
        label: {
          fontWeight: vars.weightBold.rest.label.fontWeight,
        },
      },
    },
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.rest.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeLarge.rest.root.minHeight} - ${radiomarkVars.sizeLarge.rest.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeLarge.rest.label.fontSize,
          lineHeight: vars.sizeLarge.rest.label.lineHeight,
          marginTop: `calc(${vars.sizeLarge.rest.root.minHeight} / 2 - ${vars.sizeLarge.rest.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.rest.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeMedium.rest.root.minHeight} - ${radiomarkVars.sizeMedium.rest.root.size}) / 2)`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeMedium.rest.label.fontSize,
          lineHeight: vars.sizeMedium.rest.label.lineHeight,
          marginTop: `calc(${vars.sizeMedium.rest.root.minHeight} / 2 - ${vars.sizeMedium.rest.label.lineHeight} / 2)`, // 수직 위치 보정
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    weight: "regular",
  },
});

export default radio;

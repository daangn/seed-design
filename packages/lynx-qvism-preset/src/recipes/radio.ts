import { radio as vars, radiomark as radiomarkVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 radio wrapper recipe.
 *
 * React radio 및 Lynx checkbox/switch 와 동일하게 root 는 top-align 하고,
 * mark/label 에 size 별 보정값을 주어 multiline label 에서 mark 가 중앙으로 밀리지
 * 않도록 한다.
 */
const radioRecipe = defineSlotRecipe({
  name: "radio",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
      gap: vars.base.enabled.root.gap,
    },
    label: {
      color: vars.base.enabled.label.color,
    },
  },
  variants: {
    weight: {
      regular: {
        label: { fontWeight: vars.weightRegular.enabled.label.fontWeight },
      },
      bold: {
        label: { fontWeight: vars.weightBold.enabled.label.fontWeight },
      },
    },
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeMedium.enabled.root.minHeight} - ${radiomarkVars.sizeMedium.enabled.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
          marginTop: `calc(${vars.sizeMedium.enabled.root.minHeight} / 2 - ${vars.sizeMedium.enabled.label.lineHeight} / 2)`,
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeLarge.enabled.root.minHeight} - ${radiomarkVars.sizeLarge.enabled.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
          marginTop: `calc(${vars.sizeLarge.enabled.root.minHeight} / 2 - ${vars.sizeLarge.enabled.label.lineHeight} / 2)`,
        },
      },
    },
    disabled: {
      true: {
        label: { color: vars.base.disabled.label.color },
      },
      false: {},
    },
  },
  defaultVariants: {
    weight: "regular",
    size: "medium",
    disabled: false,
  },
});

export default radioRecipe;

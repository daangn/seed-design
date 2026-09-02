import { radio as vars, radiomark as radiomarkVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 radio wrapper recipe.
 *
 * root 는 top-align 하고, mark 와 label 은 각 size 의 터치 영역 안에서 margin 으로
 * 수직 보정한다. 긴 label 이 2줄 이상으로 래핑되어도 radiomark 가 전체 label
 * 높이의 가운데로 내려가지 않는다.
 */
const radioRecipe = defineSlotRecipe({
  name: "radio",
  slots: ["root", "control", "label"],
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
        },
        control: {
          marginTop: `calc(${vars.sizeMedium.enabled.root.minHeight} / 2 - ${radiomarkVars.sizeMedium.enabled.root.size} / 2)`,
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
        },
        control: {
          marginTop: `calc(${vars.sizeLarge.enabled.root.minHeight} / 2 - ${radiomarkVars.sizeLarge.enabled.root.size} / 2)`,
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

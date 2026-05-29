import { checkmark as checkmarkVars, checkbox as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 checkbox wrapper recipe.
 *
 * Root 는 위쪽 정렬을 유지하고, mark 는 각 size 의 터치 영역 안에서만 margin 으로
 * 수직 보정한다. 긴 label 이 2줄 이상으로 래핑되어도
 * checkmark 가 전체 label 높이의 가운데로 내려가지 않도록 하기 위함이다.
 */
const checkboxRecipe = defineSlotRecipe({
  name: "checkbox",
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
          "--checkmark-margin-top": `calc((${vars.sizeMedium.enabled.root.minHeight} - ${checkmarkVars.sizeMedium.enabled.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          "--checkmark-margin-top": `calc((${vars.sizeLarge.enabled.root.minHeight} - ${checkmarkVars.sizeLarge.enabled.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
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

export default checkboxRecipe;

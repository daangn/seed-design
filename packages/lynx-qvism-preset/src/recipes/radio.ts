import { radio as vars, radiomark as radiomarkVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 radio wrapper recipe.
 *
 * Checkbox 와 동일하게 root 는 top-align 하고, mark 는 각 size 의 터치 영역
 * 안에서만 margin 으로 수직 보정한다. 긴 label 이 2줄 이상으로 래핑되어도
 * radiomark 가 전체 label 높이의 가운데로 내려가지 않고, 한 줄 label 은 Lynx
 * text 렌더링 기준으로 자연 정렬되도록 label 자체는 별도 보정하지 않는다.
 */
const radioRecipe = defineSlotRecipe({
  name: "radio",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
      gap: vars.base.rest.root.gap,
    },
    label: {
      color: vars.base.rest.label.color,
    },
  },
  variants: {
    weight: {
      regular: {
        label: { fontWeight: vars.weightRegular.rest.label.fontWeight },
      },
      bold: {
        label: { fontWeight: vars.weightBold.rest.label.fontWeight },
      },
    },
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.rest.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeMedium.rest.root.minHeight} - ${radiomarkVars.sizeMedium.rest.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeMedium.rest.label.fontSize,
          lineHeight: vars.sizeMedium.rest.label.lineHeight,
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.rest.root.minHeight,
          "--radiomark-margin-top": `calc((${vars.sizeLarge.rest.root.minHeight} - ${radiomarkVars.sizeLarge.rest.root.size}) / 2)`,
        },
        label: {
          fontSize: vars.sizeLarge.rest.label.fontSize,
          lineHeight: vars.sizeLarge.rest.label.lineHeight,
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

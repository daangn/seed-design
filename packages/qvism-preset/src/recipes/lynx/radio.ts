import { radio as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

/**
 * Lynx-전용 radio wrapper recipe.
 *
 * 웹 recipe 와 달리 `alignItems: center` 를 사용해 radiomark 와 label 을 vertical
 * center 로 정렬한다. 웹은 `<span>` 텍스트가 lineHeight box 안에서 baseline 기준이라
 * `marginTop` 으로 수동 보정이 필요하지만, Lynx `<text>` 는 native vertical center
 * 정렬이 더 안정적이라 별도 보정 변수를 두지 않는다.
 */
const radioRecipe = defineLynxSlotRecipe({
  name: "radio",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
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
        root: { minHeight: vars.sizeMedium.enabled.root.minHeight },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
      },
      large: {
        root: { minHeight: vars.sizeLarge.enabled.root.minHeight },
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

export default radioRecipe;

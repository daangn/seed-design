import { checkmark as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

/**
 * Lynx-전용 checkmark recipe.
 *
 * 웹 recipe (`../checkmark.ts`) 가 `pseudo(checked)` / `pseudo(disabled)` 등 CSS
 * pseudo selector 기반으로 상태를 표현하는 반면, Lynx 는 native form 이 없어 pseudo
 * 를 직접 사용할 수 없다. 대신 boolean variants (`checked`, `disabled`,
 * `indeterminate`) 로 상태를 일급 노출한다. 컴포넌트 런타임에서 prop 값을 그대로
 * 넘기면 `StringToBoolean` 을 통해 타입 캐스팅 없이 compile 된다.
 *
 * variant=square: 박스 + 체크 아이콘. unchecked 시 아이콘 숨김.
 * variant=ghost: 박스 없음, 항상 아이콘 표시. selected 시 tone 색상으로 강조.
 */
const checkmarkRecipe = defineLynxSlotRecipe({
  name: "checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      boxSizing: "border-box",

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    icon: {
      position: "absolute",
    },
  },
  variants: {
    variant: {
      square: {
        root: {
          borderWidth: vars.variantSquare.enabled.root.strokeWidth,
          borderStyle: "solid",
          borderColor: vars.variantSquare.enabled.root.strokeColor,
        },
      },
      ghost: {
        icon: {
          color: vars.variantGhost.enabled.icon.color,
          transition: `color ${vars.variantGhost.enabled.icon.colorDuration} ${vars.variantGhost.enabled.icon.colorTimingFunction}`,
        },
      },
    },
    tone: {
      brand: {},
      neutral: {},
    },
    size: {
      medium: {
        root: {
          width: vars.sizeMedium.enabled.root.size,
          height: vars.sizeMedium.enabled.root.size,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
      },
      large: {
        root: {
          width: vars.sizeLarge.enabled.root.size,
          height: vars.sizeLarge.enabled.root.size,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
      },
    },
    checked: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    indeterminate: {
      true: {},
      false: {},
    },
    pressed: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    // ── 아이콘 사이즈: variant × size ────────────────────────────────────────
    {
      variant: "square",
      size: "medium",
      css: {
        icon: {
          width: vars.variantSquareSizeMedium.enabled.icon.size,
          height: vars.variantSquareSizeMedium.enabled.icon.size,
        },
      },
    },
    {
      variant: "square",
      size: "large",
      css: {
        icon: {
          width: vars.variantSquareSizeLarge.enabled.icon.size,
          height: vars.variantSquareSizeLarge.enabled.icon.size,
        },
      },
    },
    {
      variant: "ghost",
      size: "medium",
      css: {
        icon: {
          width: vars.variantGhostSizeMedium.enabled.icon.size,
          height: vars.variantGhostSizeMedium.enabled.icon.size,
        },
      },
    },
    {
      variant: "ghost",
      size: "large",
      css: {
        icon: {
          width: vars.variantGhostSizeLarge.enabled.icon.size,
          height: vars.variantGhostSizeLarge.enabled.icon.size,
        },
      },
    },

    // ── square: unchecked 시 아이콘 숨김 (ghost 는 항상 보임) ─────────────────
    {
      variant: "square",
      checked: false,
      indeterminate: false,
      css: {
        icon: { opacity: 0 },
      },
    },

    // ── square: enabled,selected 시 테두리 제거 ─────────────────────────────
    {
      variant: "square",
      checked: true,
      disabled: false,
      css: {
        root: {
          borderWidth: vars.variantSquare.enabledSelected.root.strokeWidth,
          borderColor: vars.variantSquare.enabledSelected.root.strokeColor,
        },
      },
    },
    {
      variant: "square",
      indeterminate: true,
      disabled: false,
      css: {
        root: {
          borderWidth: vars.variantSquare.enabledSelected.root.strokeWidth,
          borderColor: vars.variantSquare.enabledSelected.root.strokeColor,
        },
      },
    },

    // ── square + tone: enabled,selected 색상 ────────────────────────────────
    {
      variant: "square",
      tone: "brand",
      checked: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneBrand.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneBrand.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneNeutral.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneNeutral.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "brand",
      indeterminate: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneBrand.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneBrand.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      indeterminate: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneNeutral.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneNeutral.enabledSelected.icon.color },
      },
    },

    // ── square: disabled ────────────────────────────────────────────────────
    {
      variant: "square",
      disabled: true,
      css: {
        root: {
          backgroundColor: vars.variantSquare.disabled.root.color,
          borderColor: vars.variantSquare.disabled.root.strokeColor,
        },
        icon: { color: vars.variantSquare.disabled.icon.color },
      },
    },
    {
      variant: "square",
      checked: true,
      disabled: true,
      css: {
        icon: { color: vars.variantSquare.disabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      indeterminate: true,
      disabled: true,
      css: {
        icon: { color: vars.variantSquare.disabledSelected.icon.color },
      },
    },

    // ── ghost + tone: enabled,selected 시 아이콘 색상 ────────────────────────
    {
      variant: "ghost",
      tone: "brand",
      checked: true,
      disabled: false,
      css: {
        icon: { color: vars.variantGhostToneBrand.enabledSelected.icon.color },
      },
    },
    {
      variant: "ghost",
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        icon: { color: vars.variantGhostToneNeutral.enabledSelected.icon.color },
      },
    },

    // ── ghost: disabled ─────────────────────────────────────────────────────
    {
      variant: "ghost",
      disabled: true,
      css: {
        icon: { color: vars.variantGhost.disabled.icon.color },
      },
    },
    {
      variant: "ghost",
      checked: true,
      disabled: true,
      css: {
        icon: { color: vars.variantGhost.disabledSelected.icon.color },
      },
    },

    // ── pressed: square unchecked ───────────────────────────────────────────
    {
      variant: "square",
      pressed: true,
      checked: false,
      indeterminate: false,
      disabled: false,
      css: { root: { backgroundColor: vars.variantSquare.pressed.root.color } },
    },
    // ── pressed: square + tone, selected ────────────────────────────────────
    {
      variant: "square",
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantSquareToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantSquareToneNeutral.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "brand",
      pressed: true,
      indeterminate: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantSquareToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "neutral",
      pressed: true,
      indeterminate: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantSquareToneNeutral.pressedSelected.root.color } },
    },
    // ── pressed: ghost unchecked ────────────────────────────────────────────
    {
      variant: "ghost",
      pressed: true,
      checked: false,
      indeterminate: false,
      disabled: false,
      css: { root: { backgroundColor: vars.variantGhost.pressed.root.color } },
    },
    // ── pressed: ghost + tone, selected ─────────────────────────────────────
    {
      variant: "ghost",
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantGhostToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "ghost",
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.variantGhostToneNeutral.pressedSelected.root.color } },
    },
  ],
  defaultVariants: {
    variant: "square",
    tone: "brand",
    size: "medium",
    checked: false,
    disabled: false,
    indeterminate: false,
    pressed: false,
  },
});

export default checkmarkRecipe;

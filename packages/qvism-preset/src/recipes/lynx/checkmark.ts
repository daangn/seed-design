import { checkmark as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

/**
 * Lynx-전용 checkmark recipe.
 *
 * `checked`, `disabled`, `indeterminate`, `pressed` 상태를 boolean variant로 받아
 * className 조합으로 반영한다. square는 박스와 아이콘을 함께 그리고, ghost는
 * 아이콘 색상만 상태에 맞게 바꾼다.
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
        root: { background: vars.variantSquareToneBrand.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneBrand.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: { background: vars.variantSquareToneNeutral.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneNeutral.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "brand",
      indeterminate: true,
      disabled: false,
      css: {
        root: { background: vars.variantSquareToneBrand.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneBrand.enabledSelected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      indeterminate: true,
      disabled: false,
      css: {
        root: { background: vars.variantSquareToneNeutral.enabledSelected.root.color },
        icon: { color: vars.variantSquareToneNeutral.enabledSelected.icon.color },
      },
    },

    // ── square: disabled ────────────────────────────────────────────────────
    {
      variant: "square",
      disabled: true,
      css: {
        root: {
          background: vars.variantSquare.disabled.root.color,
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
      css: { root: { background: vars.variantSquare.pressed.root.color } },
    },
    // ── pressed: square + tone, selected ────────────────────────────────────
    {
      variant: "square",
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { background: vars.variantSquareToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { background: vars.variantSquareToneNeutral.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "brand",
      pressed: true,
      indeterminate: true,
      disabled: false,
      css: { root: { background: vars.variantSquareToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "square",
      tone: "neutral",
      pressed: true,
      indeterminate: true,
      disabled: false,
      css: { root: { background: vars.variantSquareToneNeutral.pressedSelected.root.color } },
    },
    // ── pressed: ghost unchecked ────────────────────────────────────────────
    {
      variant: "ghost",
      pressed: true,
      checked: false,
      indeterminate: false,
      disabled: false,
      css: { root: { background: vars.variantGhost.pressed.root.color } },
    },
    // ── pressed: ghost + tone, selected ─────────────────────────────────────
    {
      variant: "ghost",
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { background: vars.variantGhostToneBrand.pressedSelected.root.color } },
    },
    {
      variant: "ghost",
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { background: vars.variantGhostToneNeutral.pressedSelected.root.color } },
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

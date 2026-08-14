import { checkmark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 checkmark recipe.
 *
 * `checked`, `disabled`, `indeterminate`, `pressed` 상태를 boolean variant로 받아
 * className 조합으로 반영한다. square는 박스와 아이콘을 함께 그리고, ghost는
 * 아이콘 색상만 상태에 맞게 바꾼다.
 */
const checkmarkRecipe = defineSlotRecipe({
  name: "checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      marginTop: "var(--checkmark-margin-top, 0)",

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}`,
    },
    icon: {
      position: "absolute",
    },
  },
  variants: {
    variant: {
      square: {
        root: {
          borderWidth: vars.variantSquare.rest.root.strokeWidth,
          borderStyle: "solid",
          borderColor: vars.variantSquare.rest.root.strokeColor,
        },
      },
      ghost: {
        icon: {
          color: vars.variantGhost.rest.icon.color,
          transition: `color ${vars.variantGhost.rest.icon.colorDuration} ${vars.variantGhost.rest.icon.colorTimingFunction}`,
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
          width: vars.sizeMedium.rest.root.size,
          height: vars.sizeMedium.rest.root.size,
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,
        },
      },
      large: {
        root: {
          width: vars.sizeLarge.rest.root.size,
          height: vars.sizeLarge.rest.root.size,
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,
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
          width: vars.variantSquareSizeMedium.rest.icon.size,
          height: vars.variantSquareSizeMedium.rest.icon.size,
        },
      },
    },
    {
      variant: "square",
      size: "large",
      css: {
        icon: {
          width: vars.variantSquareSizeLarge.rest.icon.size,
          height: vars.variantSquareSizeLarge.rest.icon.size,
        },
      },
    },
    {
      variant: "ghost",
      size: "medium",
      css: {
        icon: {
          width: vars.variantGhostSizeMedium.rest.icon.size,
          height: vars.variantGhostSizeMedium.rest.icon.size,
        },
      },
    },
    {
      variant: "ghost",
      size: "large",
      css: {
        icon: {
          width: vars.variantGhostSizeLarge.rest.icon.size,
          height: vars.variantGhostSizeLarge.rest.icon.size,
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
          borderWidth: vars.variantSquare.selected.root.strokeWidth,
          borderColor: vars.variantSquare.selected.root.strokeColor,
        },
      },
    },
    {
      variant: "square",
      indeterminate: true,
      disabled: false,
      css: {
        root: {
          borderWidth: vars.variantSquare.selected.root.strokeWidth,
          borderColor: vars.variantSquare.selected.root.strokeColor,
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
        root: { backgroundColor: vars.variantSquareToneBrand.selected.root.color },
        icon: { color: vars.variantSquareToneBrand.selected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneNeutral.selected.root.color },
        icon: { color: vars.variantSquareToneNeutral.selected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "brand",
      indeterminate: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneBrand.selected.root.color },
        icon: { color: vars.variantSquareToneBrand.selected.icon.color },
      },
    },
    {
      variant: "square",
      tone: "neutral",
      indeterminate: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.variantSquareToneNeutral.selected.root.color },
        icon: { color: vars.variantSquareToneNeutral.selected.icon.color },
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
        icon: { color: vars.variantSquare.selectedDisabled.icon.color },
      },
    },
    {
      variant: "square",
      indeterminate: true,
      disabled: true,
      css: {
        icon: { color: vars.variantSquare.selectedDisabled.icon.color },
      },
    },

    // ── ghost + tone: enabled,selected 시 아이콘 색상 ────────────────────────
    {
      variant: "ghost",
      tone: "brand",
      checked: true,
      disabled: false,
      css: {
        icon: { color: vars.variantGhostToneBrand.selected.icon.color },
      },
    },
    {
      variant: "ghost",
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        icon: { color: vars.variantGhostToneNeutral.selected.icon.color },
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
        icon: { color: vars.variantGhost.selectedDisabled.icon.color },
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

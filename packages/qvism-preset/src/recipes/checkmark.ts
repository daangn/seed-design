import { checkmark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, checkedOrIndeterminate, disabled, pseudo } from "../utils/pseudo";

const checkmark = defineSlotRecipe({
  name: "checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      boxSizing: "border-box",
      flexShrink: 0,

      marginTop: "var(--checkmark-margin-top, 0)", // 수직 위치 보정
    },
    icon: {
      display: "none",
      content: '""',
      position: "absolute",
      margin: "auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      textAlign: "center",
      overflow: "initial",
    },
  },
  variants: {
    variant: {
      square: {
        root: {
          borderWidth: vars.variantSquare.enabled.root.strokeWidth,
          borderStyle: "solid",
          borderColor: vars.variantSquare.enabled.root.strokeColor,

          [pseudo(checkedOrIndeterminate)]: {
            borderWidth: 0,
          },
          [pseudo(active)]: {
            background: vars.variantSquare.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantSquare.disabled.root.color,
            borderColor: vars.variantSquare.disabled.root.strokeColor,
          },
          [pseudo(disabled, active)]: {
            background: vars.variantSquare.disabled.root.color,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            display: "block",
          },
          [pseudo(disabled, checkedOrIndeterminate)]: {
            display: "block",
            color: vars.variantSquare.disabledSelected.icon.color,
          },
        },
      },
      ghost: {
        root: {
          background: "none",

          [pseudo(checkedOrIndeterminate)]: {
            background: "none",
          },
          [pseudo(active)]: {
            background: vars.variantGhost.pressed.root.color,
          },
          [pseudo(disabled, checkedOrIndeterminate)]: {
            background: "none",
          },
          [pseudo(disabled, active)]: {
            background: "none",
          },
        },
        icon: {
          display: "block",
          color: vars.variantGhost.enabled.icon.color,

          [pseudo(disabled, checkedOrIndeterminate)]: {
            color: vars.variantGhost.disabledSelected.icon.color,
          },
          [pseudo(disabled)]: {
            color: vars.variantGhost.disabled.icon.color,
          },
        },
      },
    },
    tone: {
      neutral: {},
      brand: {},
    },
    size: {
      large: {
        root: {
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          width: vars.sizeLarge.enabled.root.size,
          height: vars.sizeLarge.enabled.root.size,
        },
      },
      medium: {
        root: {
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          width: vars.sizeMedium.enabled.root.size,
          height: vars.sizeMedium.enabled.root.size,
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: "square",
      tone: "neutral",
      css: {
        root: {
          [pseudo(checkedOrIndeterminate)]: {
            background: vars.variantSquareToneNeutral.enabledSelected.root.color,
          },
          [pseudo(active, checkedOrIndeterminate)]: {
            background: vars.variantSquareToneNeutral.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            color: vars.variantSquareToneNeutral.enabledSelected.icon.color,
          },
        },
      },
    },
    {
      variant: "square",
      tone: "brand",
      css: {
        root: {
          [pseudo(checkedOrIndeterminate)]: {
            background: vars.variantSquareToneBrand.enabledSelected.root.color,
          },
          [pseudo(active, checkedOrIndeterminate)]: {
            background: vars.variantSquareToneBrand.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            color: vars.variantSquareToneBrand.enabledSelected.icon.color,
          },
        },
      },
    },
    {
      variant: "ghost",
      tone: "neutral",
      css: {
        root: {
          [pseudo(active, checkedOrIndeterminate)]: {
            background: vars.variantGhostToneNeutral.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            color: vars.variantGhostToneNeutral.enabledSelected.icon.color,
          },
        },
      },
    },
    {
      variant: "ghost",
      tone: "brand",
      css: {
        root: {
          [pseudo(active, checkedOrIndeterminate)]: {
            background: vars.variantGhostToneBrand.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            color: vars.variantGhostToneBrand.enabledSelected.icon.color,
          },
        },
      },
    },
    {
      size: "medium",
      variant: "ghost",
      css: {
        icon: {
          width: vars.variantGhostSizeMedium.enabled.icon.size,
          height: vars.variantGhostSizeMedium.enabled.icon.size,
        },
      },
    },
    {
      size: "large",
      variant: "ghost",
      css: {
        icon: {
          width: vars.variantGhostSizeLarge.enabled.icon.size,
          height: vars.variantGhostSizeLarge.enabled.icon.size,
        },
      },
    },
    {
      size: "medium",
      variant: "square",
      css: {
        icon: {
          width: vars.variantSquareSizeMedium.enabled.icon.size,
          height: vars.variantSquareSizeMedium.enabled.icon.size,
        },
      },
    },
    {
      size: "large",
      variant: "square",
      css: {
        icon: {
          width: vars.variantSquareSizeLarge.enabled.icon.size,
          height: vars.variantSquareSizeLarge.enabled.icon.size,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "square",
    tone: "neutral",
    size: "medium",
  },
});

export default checkmark;

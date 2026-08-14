import spec from "@seed-design/rootage-artifacts/components/checkmark";
import { checkmark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import {
  engaged,
  checkedOrIndeterminate,
  disabled,
  focusVisible,
  not,
  pseudo,
} from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const checkmark = defineSlotRecipe({
  name: "checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      boxSizing: "border-box",
      flex: "none",

      marginTop: "var(--checkmark-margin-top, 0)", // 수직 위치 보정

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ overridableBy: "--seed-focus-ring" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ overridableBy: "--seed-focus-ring" }),
    },
    icon: {
      display: "none",
      content: '""',
      position: "absolute",
      margin: "auto",
      inset: 0,
      textAlign: "center",
      overflow: "initial",
    },
  },
  variants: {
    variant: {
      square: {
        root: {
          borderWidth: vars.variantSquare.rest.root.strokeWidth,
          borderStyle: "solid",
          borderColor: vars.variantSquare.rest.root.strokeColor,

          [pseudo(checkedOrIndeterminate)]: {
            borderWidth: 0,
          },
          [pseudo(not(disabled), engaged)]: {
            background: vars.variantSquare.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantSquare.disabled.root.color,
            borderColor: vars.variantSquare.disabled.root.strokeColor,
          },
        },
        icon: {
          [pseudo(checkedOrIndeterminate)]: {
            display: "block",
          },
          [pseudo(disabled, checkedOrIndeterminate)]: {
            color: vars.variantSquare.selectedDisabled.icon.color,
          },
        },
      },
      ghost: {
        root: {
          [pseudo(not(disabled), engaged)]: {
            background: vars.variantGhost.pressed.root.color,
          },
        },
        icon: {
          display: "block",
          color: vars.variantGhost.rest.icon.color,

          transition: `color ${vars.variantGhost.rest.icon.colorDuration} ${vars.variantGhost.rest.icon.colorTimingFunction}`,

          [pseudo(disabled)]: {
            color: vars.variantGhost.disabled.icon.color,
          },
          [pseudo(disabled, checkedOrIndeterminate)]: {
            color: vars.variantGhost.selectedDisabled.icon.color,
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
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,
          width: vars.sizeLarge.rest.root.size,
          height: vars.sizeLarge.rest.root.size,
        },
      },
      medium: {
        root: {
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,
          width: vars.sizeMedium.rest.root.size,
          height: vars.sizeMedium.rest.root.size,
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
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            background: vars.variantSquareToneNeutral.selected.root.color,
          },
          [pseudo(not(disabled), checkedOrIndeterminate, engaged)]: {
            background: vars.variantSquareToneNeutral.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            color: vars.variantSquareToneNeutral.selected.icon.color,
          },
        },
      },
    },
    {
      variant: "square",
      tone: "brand",
      css: {
        root: {
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            background: vars.variantSquareToneBrand.selected.root.color,
          },
          [pseudo(not(disabled), checkedOrIndeterminate, engaged)]: {
            background: vars.variantSquareToneBrand.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            color: vars.variantSquareToneBrand.selected.icon.color,
          },
        },
      },
    },
    {
      variant: "ghost",
      tone: "neutral",
      css: {
        root: {
          [pseudo(not(disabled), checkedOrIndeterminate, engaged)]: {
            background: vars.variantGhostToneNeutral.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            color: vars.variantGhostToneNeutral.selected.icon.color,
          },
        },
      },
    },
    {
      variant: "ghost",
      tone: "brand",
      css: {
        root: {
          [pseudo(not(disabled), checkedOrIndeterminate, engaged)]: {
            background: vars.variantGhostToneBrand.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(not(disabled), checkedOrIndeterminate)]: {
            color: vars.variantGhostToneBrand.selected.icon.color,
          },
        },
      },
    },
    {
      size: "medium",
      variant: "ghost",
      css: {
        icon: {
          width: vars.variantGhostSizeMedium.rest.icon.size,
          height: vars.variantGhostSizeMedium.rest.icon.size,
        },
      },
    },
    {
      size: "large",
      variant: "ghost",
      css: {
        icon: {
          width: vars.variantGhostSizeLarge.rest.icon.size,
          height: vars.variantGhostSizeLarge.rest.icon.size,
        },
      },
    },
    {
      size: "medium",
      variant: "square",
      css: {
        icon: {
          width: vars.variantSquareSizeMedium.rest.icon.size,
          height: vars.variantSquareSizeMedium.rest.icon.size,
        },
      },
    },
    {
      size: "large",
      variant: "square",
      css: {
        icon: {
          width: vars.variantSquareSizeLarge.rest.icon.size,
          height: vars.variantSquareSizeLarge.rest.icon.size,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "square",
    tone: "brand",
    size: "medium",
  },
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default checkmark;

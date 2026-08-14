import { radiomark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { checked, disabled, engaged, pseudo, not, focusVisible } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/radiomark";

const radiomark = defineSlotRecipe({
  name: "radiomark",
  slots: ["root", "icon"],
  base: {
    root: {
      borderStyle: "solid",
      boxSizing: "border-box",
      position: "relative",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",

      borderWidth: vars.base.rest.root.strokeWidth,
      borderColor: vars.base.rest.root.strokeColor,

      borderRadius: vars.base.rest.root.cornerRadius,

      marginTop: "var(--radiomark-margin-top, 0)", // 수직 위치 보정

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ overridableBy: "--seed-focus-ring" }),

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      [pseudo(checked)]: {
        borderWidth: vars.base.selected.root.strokeWidth,
      },

      [pseudo(disabled)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        backgroundColor: vars.toneBrand.disabled.root.color,
      },

      [pseudo(disabled, checked)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        backgroundColor: vars.toneBrand.selectedDisabled.root.color,
        borderWidth: vars.toneBrand.selectedDisabled.root.strokeWidth,
        borderColor: vars.toneBrand.selectedDisabled.root.strokeColor,
      },

      [pseudo(focusVisible)]: createFocusRingStyles({ overridableBy: "--seed-focus-ring" }),
    },
    icon: {
      display: "none",
      borderRadius: vars.base.rest.icon.cornerRadius,

      [pseudo(checked)]: {
        display: "block",
      },

      [pseudo(disabled, checked)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        color: vars.toneBrand.selectedDisabled.icon.color,
      },
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          [pseudo(checked)]: {
            backgroundColor: vars.toneNeutral.selected.root.color,
          },

          [pseudo(not(disabled), checked, engaged)]: {
            backgroundColor: vars.toneNeutral.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checked)]: {
            color: vars.toneNeutral.selected.icon.color,
          },
        },
      },
      brand: {
        root: {
          [pseudo(checked)]: {
            backgroundColor: vars.toneBrand.selected.root.color,
          },

          [pseudo(not(disabled), checked, engaged)]: {
            backgroundColor: vars.toneBrand.pressedSelected.root.color,
          },
        },
        icon: {
          [pseudo(checked)]: {
            color: vars.toneBrand.selected.icon.color,
          },
        },
      },
    },
    size: {
      large: {
        root: {
          width: vars.sizeLarge.rest.root.size,
          height: vars.sizeLarge.rest.root.size,
        },
        icon: {
          width: vars.sizeLarge.rest.icon.size,
          height: vars.sizeLarge.rest.icon.size,

          [pseudo(disabled)]: {
            width: vars.sizeLarge.disabled.icon.size,
            height: vars.sizeLarge.disabled.icon.size,
          },
        },
      },
      medium: {
        root: {
          width: vars.sizeMedium.rest.root.size,
          height: vars.sizeMedium.rest.root.size,
        },
        icon: {
          width: vars.sizeMedium.rest.icon.size,
          height: vars.sizeMedium.rest.icon.size,

          [pseudo(disabled)]: {
            width: vars.sizeMedium.disabled.icon.size,
            height: vars.sizeMedium.disabled.icon.size,
          },
        },
      },
    },
  },
  defaultVariants: {
    tone: "brand",
    size: "medium",
  },
  metadata: {
    variants: {
      tone: spec.data.schema.variants.tone,
    },
  },
});

export default radiomark;

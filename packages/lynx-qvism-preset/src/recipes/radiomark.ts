import { radiomark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 radiomark recipe.
 *
 * `checked`, `disabled`, `pressed` 상태를 boolean variant로 받아 className 조합으로
 * 반영한다.
 */
const radiomarkRecipe = defineSlotRecipe({
  name: "radiomark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      marginTop: "var(--radiomark-margin-top, 0)",

      borderWidth: vars.base.rest.root.strokeWidth,
      borderStyle: "solid",
      borderColor: vars.base.rest.root.strokeColor,
      borderRadius: vars.base.rest.root.cornerRadius,

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}`,
    },
    icon: {
      borderRadius: vars.base.rest.icon.cornerRadius,
    },
  },
  variants: {
    tone: {
      brand: {},
      neutral: {},
    },
    size: {
      medium: {
        root: {
          width: vars.sizeMedium.rest.root.size,
          height: vars.sizeMedium.rest.root.size,
        },
        icon: {
          width: vars.sizeMedium.rest.icon.size,
          height: vars.sizeMedium.rest.icon.size,
        },
      },
      large: {
        root: {
          width: vars.sizeLarge.rest.root.size,
          height: vars.sizeLarge.rest.root.size,
        },
        icon: {
          width: vars.sizeLarge.rest.icon.size,
          height: vars.sizeLarge.rest.icon.size,
        },
      },
    },
    checked: {
      true: {},
      false: {
        icon: { opacity: 0 },
      },
    },
    disabled: {
      true: {},
      false: {},
    },
    pressed: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: "brand",
      checked: true,
      disabled: false,
      css: {
        root: {
          backgroundColor: vars.toneBrand.selected.root.color,
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.selected.root.strokeColor,
        },
        icon: {
          color: vars.toneBrand.selected.icon.color,
          backgroundColor: vars.toneBrand.selected.icon.color,
        },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: {
          backgroundColor: vars.toneNeutral.selected.root.color,
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.selected.root.strokeColor,
        },
        icon: {
          color: vars.toneNeutral.selected.icon.color,
          backgroundColor: vars.toneNeutral.selected.icon.color,
        },
      },
    },
    {
      tone: "brand",
      checked: false,
      disabled: true,
      css: {
        root: { backgroundColor: vars.toneBrand.disabled.root.color },
      },
    },
    {
      tone: "neutral",
      checked: false,
      disabled: true,
      css: {
        root: { backgroundColor: vars.toneNeutral.disabled.root.color },
      },
    },
    {
      tone: "brand",
      checked: true,
      disabled: true,
      css: {
        root: {
          backgroundColor: vars.toneBrand.selectedDisabled.root.color,
          borderWidth: vars.toneBrand.selectedDisabled.root.strokeWidth,
          borderColor: vars.toneBrand.selectedDisabled.root.strokeColor,
        },
        icon: {
          color: vars.toneBrand.selectedDisabled.icon.color,
          backgroundColor: vars.toneBrand.selectedDisabled.icon.color,
        },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: true,
      css: {
        root: {
          backgroundColor: vars.toneNeutral.selectedDisabled.root.color,
          borderWidth: vars.toneNeutral.selectedDisabled.root.strokeWidth,
          borderColor: vars.toneNeutral.selectedDisabled.root.strokeColor,
        },
        icon: {
          color: vars.toneNeutral.selectedDisabled.icon.color,
          backgroundColor: vars.toneNeutral.selectedDisabled.icon.color,
        },
      },
    },
    {
      size: "medium",
      checked: true,
      disabled: true,
      css: {
        icon: {
          width: vars.sizeMedium.disabled.icon.size,
          height: vars.sizeMedium.disabled.icon.size,
        },
      },
    },
    {
      size: "large",
      checked: true,
      disabled: true,
      css: {
        icon: {
          width: vars.sizeLarge.disabled.icon.size,
          height: vars.sizeLarge.disabled.icon.size,
        },
      },
    },

    // ── pressed: unchecked ─────────────────────────────────────────────────
    {
      pressed: true,
      checked: false,
      disabled: false,
      css: { root: { backgroundColor: vars.base.pressed.root.color } },
    },
    // ── pressed: tone + selected ───────────────────────────────────────────
    {
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.toneBrand.pressedSelected.root.color } },
    },
    {
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.toneNeutral.pressedSelected.root.color } },
    },
  ],
  defaultVariants: {
    tone: "brand",
    size: "medium",
    checked: false,
    disabled: false,
    pressed: false,
  },
});

export default radiomarkRecipe;

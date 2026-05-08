import { radiomark as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

/**
 * Lynx-전용 radiomark recipe.
 *
 * `checked`, `disabled`, `pressed` 상태를 boolean variant로 받아 className 조합으로
 * 반영한다.
 */
const radiomarkRecipe = defineLynxSlotRecipe({
  name: "radiomark",
  slots: ["root", "icon"],
  base: {
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",

      borderWidth: vars.base.enabled.root.strokeWidth,
      borderStyle: "solid",
      borderColor: vars.base.enabled.root.strokeColor,
      borderRadius: vars.base.enabled.root.cornerRadius,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    icon: {
      borderRadius: vars.base.enabled.icon.cornerRadius,
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
          width: vars.sizeMedium.enabled.root.size,
          height: vars.sizeMedium.enabled.root.size,
        },
        icon: {
          width: vars.sizeMedium.enabled.icon.size,
          height: vars.sizeMedium.enabled.icon.size,
        },
      },
      large: {
        root: {
          width: vars.sizeLarge.enabled.root.size,
          height: vars.sizeLarge.enabled.root.size,
        },
        icon: {
          width: vars.sizeLarge.enabled.icon.size,
          height: vars.sizeLarge.enabled.icon.size,
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
          backgroundColor: vars.toneBrand.enabledSelected.root.color,
          borderWidth: vars.base.enabledSelected.root.strokeWidth,
          borderColor: vars.base.enabledSelected.root.strokeColor,
        },
        icon: {
          color: vars.toneBrand.enabledSelected.icon.color,
          backgroundColor: vars.toneBrand.enabledSelected.icon.color,
        },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: {
          backgroundColor: vars.toneNeutral.enabledSelected.root.color,
          borderWidth: vars.base.enabledSelected.root.strokeWidth,
          borderColor: vars.base.enabledSelected.root.strokeColor,
        },
        icon: {
          color: vars.toneNeutral.enabledSelected.icon.color,
          backgroundColor: vars.toneNeutral.enabledSelected.icon.color,
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
          backgroundColor: vars.toneBrand.disabledSelected.root.color,
          borderWidth: vars.toneBrand.disabledSelected.root.strokeWidth,
          borderColor: vars.toneBrand.disabledSelected.root.strokeColor,
        },
        icon: {
          color: vars.toneBrand.disabledSelected.icon.color,
          backgroundColor: vars.toneBrand.disabledSelected.icon.color,
        },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: true,
      css: {
        root: {
          backgroundColor: vars.toneNeutral.disabledSelected.root.color,
          borderWidth: vars.toneNeutral.disabledSelected.root.strokeWidth,
          borderColor: vars.toneNeutral.disabledSelected.root.strokeColor,
        },
        icon: {
          color: vars.toneNeutral.disabledSelected.icon.color,
          backgroundColor: vars.toneNeutral.disabledSelected.icon.color,
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
      css: { root: { backgroundColor: vars.base.enabledPressed.root.color } },
    },
    // ── pressed: tone + selected ───────────────────────────────────────────
    {
      tone: "brand",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.toneBrand.enabledSelectedPressed.root.color } },
    },
    {
      tone: "neutral",
      pressed: true,
      checked: true,
      disabled: false,
      css: { root: { backgroundColor: vars.toneNeutral.enabledSelectedPressed.root.color } },
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

import { radiomark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { checked, disabled, active, pseudo, not } from "../utils/pseudo";

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

      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,

      borderRadius: vars.base.enabled.root.cornerRadius,

      marginTop: "var(--radiomark-margin-top, 0)", // 수직 위치 보정

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,

      [pseudo(not(disabled), active)]: {
        backgroundColor: vars.base.enabledPressed.root.color,
      },

      [pseudo(checked)]: {
        borderWidth: vars.base.enabledSelected.root.strokeWidth,
      },

      [pseudo(disabled)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        backgroundColor: vars.toneBrand.disabled.root.color,
      },

      [pseudo(disabled, checked)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        backgroundColor: vars.toneBrand.disabledSelected.root.color,
        borderWidth: vars.toneBrand.disabledSelected.root.strokeWidth,
        borderColor: vars.toneBrand.disabledSelected.root.strokeColor,
      },
    },
    icon: {
      display: "none",
      borderRadius: vars.base.enabled.icon.cornerRadius,

      [pseudo(checked)]: {
        display: "block",
      },

      [pseudo(disabled, checked)]: {
        // we use toneBrand here; rootage needs some more clarification on this
        color: vars.toneBrand.disabledSelected.icon.color,
      },
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          [pseudo(checked)]: {
            backgroundColor: vars.toneNeutral.enabledSelected.root.color,
          },

          [pseudo(not(disabled), checked, active)]: {
            backgroundColor: vars.toneNeutral.enabledSelectedPressed.root.color,
          },
        },
        icon: {
          [pseudo(checked)]: {
            color: vars.toneNeutral.enabledSelected.icon.color,
          },
        },
      },
      brand: {
        root: {
          [pseudo(checked)]: {
            backgroundColor: vars.toneBrand.enabledSelected.root.color,
          },

          [pseudo(not(disabled), checked, active)]: {
            backgroundColor: vars.toneBrand.enabledSelectedPressed.root.color,
          },
        },
        icon: {
          [pseudo(checked)]: {
            color: vars.toneBrand.enabledSelected.icon.color,
          },
        },
      },
    },
    size: {
      large: {
        root: {
          width: vars.sizeLarge.enabled.root.size,
          height: vars.sizeLarge.enabled.root.size,
        },
        icon: {
          width: vars.sizeLarge.enabled.icon.size,
          height: vars.sizeLarge.enabled.icon.size,

          [pseudo(disabled)]: {
            width: vars.sizeLarge.disabled.icon.size,
            height: vars.sizeLarge.disabled.icon.size,
          },
        },
      },
      medium: {
        root: {
          width: vars.sizeMedium.enabled.root.size,
          height: vars.sizeMedium.enabled.root.size,
        },
        icon: {
          width: vars.sizeMedium.enabled.icon.size,
          height: vars.sizeMedium.enabled.icon.size,

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
});

export default radiomark;

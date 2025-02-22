import { radio as vars } from "@seed-design/css/vars/component";
import { defineRecipe } from "../utils/define";
import { checked, disabled, active, pseudo } from "../utils/pseudo";

const radio = defineRecipe({
  name: "radio",
  slots: ["root", "icon"],
  base: {
    root: {
      borderStyle: "solid",
      boxSizing: "border-box",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",

      backgroundColor: vars.base.enabled.root.color,

      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,

      borderRadius: vars.base.enabled.root.cornerRadius,

      [pseudo(active)]: {
        backgroundColor: vars.base.enabledPressed.root.color,
      },

      [pseudo(checked)]: {
        backgroundColor: vars.base.enabledSelected.root.color,
        borderWidth: vars.base.enabledSelected.root.strokeWidth,
      },

      [pseudo(active, checked)]: {
        backgroundColor: vars.base.enabledSelectedPressed.root.color,
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(disabled, checked)]: {
        backgroundColor: "none",
        borderColor: vars.base.disabledSelected.root.strokeColor,
      },
    },
    icon: {
      display: "none",
      borderRadius: vars.base.enabled.icon.cornerRadius,

      [pseudo(checked)]: {
        display: "block",
        backgroundColor: vars.base.enabledSelected.icon.color,
      },

      [pseudo(disabled, checked)]: {
        backgroundColor: vars.base.disabledSelected.icon.color,
      },
    },
  },
  variants: {
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
    size: "medium",
  },
});

export default radio;

import { vars } from "./__generated__/chip-tab.vars";
import { defineRecipe } from "./helper";
import { pseudo, selected, active, disabled, not } from "./pseudo";

const chipTab = defineRecipe({
  name: "chipTab",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: `${vars.base.enabled.root.paddingY} ${vars.base.enabled.root.paddingX}`,
      cursor: "pointer",
      border: "none",
      borderRadius: vars.base.enabled.root.cornerRadius,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      minHeight: vars.base.enabled.root.minHeight,

      [pseudo(selected)]: {
        backgroundColor: vars.base.selected.root.color,
      },

      [pseudo(active, not(disabled))]: {
        backgroundColor: vars.base.enabledPressed.root.color,
      },

      [pseudo(selected, active)]: {
        backgroundColor: vars.base.selectedPressed.root.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        backgroundColor: undefined,
      },

      [pseudo(disabled, selected)]: {
        backgroundColor: vars.base.selectedDisabled.root.color,
      },
    },
    label: {
      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      fontWeight: vars.base.enabled.label.fontWeight,

      [pseudo(selected)]: {
        color: vars.base.selected.label.color,
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
  },
  variants: {},
});

export default chipTab;

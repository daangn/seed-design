import { chipTab as vars } from "@seed-design/vars/component";
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
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
  },
  variants: {
    variant: {
      neutralSolid: {
        root: {
          [pseudo(selected)]: {
            backgroundColor: vars.variantNeutralSolid.selected.root.color,
          },

          [pseudo(active)]: {
            backgroundColor: vars.variantNeutralSolid.enabledPressed.root.color,
          },

          [pseudo(selected, active)]: {
            backgroundColor: vars.variantNeutralSolid.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            backgroundColor: undefined,
          },

          [pseudo(disabled, selected)]: {
            backgroundColor: vars.variantNeutralSolid.selectedDisabled.root.color,
          },
        },

        label: {
          color: vars.variantNeutralSolid.enabled.label.color,
          fontWeight: vars.base.enabled.label.fontWeight,

          [pseudo(selected)]: {
            color: vars.variantNeutralSolid.selected.label.color,
          },

          [pseudo(disabled)]: {
            color: vars.variantNeutralSolid.disabled.label.color,
          },

          [pseudo(disabled, selected)]: {
            color: vars.variantNeutralSolid.selectedDisabled.label.color,
          },
        },
      },
      brandWeak: {
        root: {
          fontWeight: vars.variantBrandWeak.enabled.label.fontWeight,
          backgroundColor: vars.variantBrandWeak.enabled.root.color,

          [pseudo(selected)]: {
            backgroundColor: vars.variantBrandWeak.selected.root.color,
          },

          [pseudo(active)]: {
            backgroundColor: vars.variantBrandWeak.enabledPressed.root.color,
          },

          [pseudo(selected, active)]: {
            backgroundColor: vars.variantBrandWeak.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            backgroundColor: vars.variantBrandWeak.disabled.root.color,
          },

          [pseudo(disabled, selected)]: {
            backgroundColor: vars.variantBrandWeak.selectedDisabled.root.color,
          },
        },

        label: {
          color: vars.variantBrandWeak.enabled.label.color,
          fontWeight: vars.variantBrandWeak.enabled.label.fontWeight,

          [pseudo(selected)]: {
            color: vars.variantBrandWeak.selected.label.color,
            fontWeight: vars.variantBrandWeak.selected.label.fontWeight,
          },

          [pseudo(disabled)]: {
            color: vars.variantBrandWeak.disabled.label.color,
          },
        },
      },
    },
  },
});

export default chipTab;

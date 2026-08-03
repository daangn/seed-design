import { field as fieldVars, fieldLabel as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const fieldLabel = defineSlotRecipe({
  name: "field-label",
  slots: ["root", "indicatorText", "indicatorIcon"],
  base: {
    root: {
      color: vars.base.enabled.root.color,
      fontSize: vars.base.enabled.root.fontSize,
      lineHeight: vars.base.enabled.root.lineHeight,
    },
    indicatorText: {
      color: fieldVars.base.enabled.indicatorText.color,
      fontSize: fieldVars.base.enabled.indicatorText.fontSize,
      lineHeight: fieldVars.base.enabled.indicatorText.lineHeight,
      fontWeight: fieldVars.base.enabled.indicatorText.fontWeight,
      paddingLeft: fieldVars.base.enabled.indicatorText.paddingLeft,
    },
    indicatorIcon: {
      color: fieldVars.base.enabled.indicatorIcon.color,
      fontSize: fieldVars.base.enabled.indicatorIcon.size,
      lineHeight: fieldVars.base.enabled.indicatorIcon.size,
      paddingTop: fieldVars.base.enabled.indicatorIcon.paddingTop,
      paddingLeft: fieldVars.base.enabled.indicatorIcon.paddingLeft,
    },
  },
  variants: {
    weight: {
      medium: {
        root: {
          fontWeight: vars.weightMedium.enabled.root.fontWeight,
        },
      },
      bold: {
        root: {
          fontWeight: vars.weightBold.enabled.root.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    weight: "medium",
  },
});

export default fieldLabel;

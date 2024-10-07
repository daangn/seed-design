import { vars } from "./__generated__/expand-button.vars";
import { defineRecipe } from "./helper";
import { disabled, focus, active, pseudo } from "./pseudo";

const expandButton = defineRecipe({
  name: "expandButton",
  slots: ["root", "label", "suffixIcon"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      textTransform: "none",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textDecoration: "none",
      width: "100%",

      backgroundColor: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      minHeight: vars.base.enabled.root.minHeight,
      gap: vars.base.enabled.root.gap,
      padding: `${vars.base.enabled.root.paddingY} ${vars.base.enabled.root.paddingX}`,

      border: `${vars.base.enabled.root.strokeWidth} solid ${vars.base.enabled.root.strokeColor}`,

      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      fontWeight: vars.base.enabled.label.fontWeight,

      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(active)]: {
        backgroundColor: vars.base.pressed.root.color,
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",

        backgroundColor: vars.base.disabled.root.color,
        color: vars.base.disabled.label.color,
      },
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      color: vars.base.enabled.suffixIcon.color,
      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,
    },
  },
  variants: {},
});

export default expandButton;

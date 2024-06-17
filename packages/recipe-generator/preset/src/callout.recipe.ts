import { vars } from "./__generated__/callout.vars";
import { defineRecipe } from "./helper";

export const callout = defineRecipe({
  name: "callout",
  slots: ["root", "icon", "content", "title", "description", "actionIndicator", "closeButton"],
  base: {
    root: {
      display: "flex",
      boxSizing: "border-box",

      border: "none",
      textTransform: "none",
      textAlign: "start",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",

      padding: `${vars.base.enabled.root.paddingY} ${vars.base.enabled.root.paddingX}`,
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    content: {
      flex: "1 1 auto",
    },
    title: {
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    icon: {
      alignSelf: "flex-start",
      height: vars.base.enabled.icon.size,
      width: "auto",
      marginRight: vars.base.enabled.icon.marginRight,
    },
    actionIndicator: {
      alignSelf: "center",

      height: vars.base.enabled.actionIndicator.size,
      width: "auto",
      marginLeft: vars.base.enabled.actionIndicator.marginLeft,
    },
    closeButton: {
      alignSelf: "center",
      cursor: "pointer",

      height: vars.base.enabled.closeButton.size,
      width: "auto",
      marginLeft: vars.base.enabled.closeButton.marginLeft,
    },
  },
  variants: {
    variant: {
      outline: {
        root: {
          boxShadow: `0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.variantOutline.enabled.root.strokeColor} inset`,
          color: vars.variantOutline.enabled.description.color,
        },
      },
      neutral: {
        root: {
          backgroundColor: vars.variantNeutral.enabled.root.color,
          color: vars.variantNeutral.enabled.description.color,
        },
      },
      informative: {
        root: {
          backgroundColor: vars.variantInformative.enabled.root.color,
          color: vars.variantInformative.enabled.description.color,
        },
      },
      warning: {
        root: {
          backgroundColor: vars.variantWarning.enabled.root.color,
          color: vars.variantWarning.enabled.description.color,
        },
      },
      danger: {
        root: {
          backgroundColor: vars.variantDanger.enabled.root.color,
          color: vars.variantDanger.enabled.description.color,
        },
      },
    },
  },
});

export default callout;

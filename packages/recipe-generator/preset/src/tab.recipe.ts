import { vars } from "./__generated__/tab.vars";
import { defineRecipe } from "./helper";
import { active, disabled, pseudo } from "./pseudo";

const tab = defineRecipe({
  name: "tab",
  slots: ["root", "label", "notification"],
  base: {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      cursor: "pointer",
      border: "none",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
    },
    label: {
      color: vars.base.enabled.label.color,
      [pseudo(active)]: {
        color: vars.base.selected.label.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
        cursor: "not-allowed",
      },
    },
    notification: {
      backgroundColor: vars.base.enabled.notification.color,
      width: vars.base.enabled.notification.size,
      height: vars.base.enabled.notification.size,
      borderRadius: vars.base.enabled.notification.cornerRadius,
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          fontWeight: vars.sizeMedium.enabled.label.fontWeight,
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          paddingInline: vars.sizeSmall.enabled.root.paddingX,
          paddingBlock: vars.sizeSmall.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          fontWeight: vars.sizeSmall.enabled.label.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default tab;

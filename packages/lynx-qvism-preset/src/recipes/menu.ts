import { defineSlotRecipe } from "../utils/define";
import { menu as menuVars, menuItem as menuItemVars } from "../vars/component";

export const menu = defineSlotRecipe({
  name: "menu",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "scrollArea",
    "scrollContent",
    "group",
    "groupLabel",
    "separator",
  ],
  base: {
    positioner: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
    },
    backdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    content: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      borderRadius: menuVars.base.enabled.root.cornerRadius,
      backgroundColor: menuVars.base.enabled.root.color,
      boxShadow: menuVars.base.enabled.root.shadow,
      overflow: "hidden",
      transitionProperty: "opacity, transform",
    },
    scrollArea: {
      width: "100%",
      maxHeight: menuVars.base.enabled.root.maxHeight,
    },
    scrollContent: {
      display: "flex",
      flexDirection: "column",
      paddingTop: menuVars.base.enabled.root.paddingY,
      paddingBottom: menuVars.base.enabled.root.paddingY,
      gap: menuVars.base.enabled.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    },
    groupLabel: {
      color: menuVars.base.enabled.groupLabel.color,
      flexShrink: 0,
    },
    separator: {
      height: menuVars.base.enabled.divider.height,
      flexShrink: 0,
      marginLeft: menuVars.base.enabled.divider.marginX,
      marginRight: menuVars.base.enabled.divider.marginX,
      marginBottom: menuVars.base.enabled.root.gap,
      backgroundColor: menuVars.base.enabled.divider.color,
    },
  },
  variants: {
    size: {
      medium: {
        content: { width: menuVars.sizeMedium.enabled.root.width },
        groupLabel: {
          paddingTop: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingBottom: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingLeft: menuVars.sizeMedium.enabled.groupLabel.paddingX,
          paddingRight: menuVars.sizeMedium.enabled.groupLabel.paddingX,
          fontSize: menuVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
      },
      small: {
        content: { width: menuVars.sizeSmall.enabled.root.width },
        groupLabel: {
          paddingTop: menuVars.sizeSmall.enabled.groupLabel.paddingY,
          paddingBottom: menuVars.sizeSmall.enabled.groupLabel.paddingY,
          paddingLeft: menuVars.sizeSmall.enabled.groupLabel.paddingX,
          paddingRight: menuVars.sizeSmall.enabled.groupLabel.paddingX,
          fontSize: menuVars.sizeSmall.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeSmall.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeSmall.enabled.groupLabel.fontWeight,
        },
      },
    },
    open: {
      true: {
        content: {
          opacity: 1,
          transform: "scale(1)",
          transitionDuration: menuVars.base.enabled.root.enterDuration,
          transitionTimingFunction: menuVars.base.enabled.root.enterTimingFunction,
        },
      },
      false: {
        content: {
          opacity: menuVars.base.enabled.root.exitOpacity,
          transform: `scale(${menuVars.base.enabled.root.exitScale})`,
          transitionDuration: menuVars.base.enabled.root.exitDuration,
          transitionTimingFunction: menuVars.base.enabled.root.exitTimingFunction,
        },
      },
    },
    positioned: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      positioned: false,
      css: {
        content: {
          opacity: menuVars.base.enabled.root.enterOpacity,
          transform: "scale(1)",
          transitionDuration: "0s",
        },
      },
    },
    {
      open: true,
      positioned: true,
      css: {
        content: {
          animationName: "seed-enter",
          animationDuration: menuVars.base.enabled.root.enterDuration,
          animationTimingFunction: menuVars.base.enabled.root.enterTimingFunction,
          "--seed-enter-opacity": menuVars.base.enabled.root.enterOpacity,
          "--seed-enter-scale": menuVars.base.enabled.root.enterScale,
        },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    open: false,
    positioned: false,
  },
});

export const menuItem = defineSlotRecipe({
  name: "menu-item",
  slots: ["root", "pressedOverlay", "body", "label", "description", "prefixIcon", "suffixIcon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    pressedOverlay: {
      position: "absolute",
      top: 0,
      right: menuItemVars.base.pressed.root.marginX,
      bottom: 0,
      left: menuItemVars.base.pressed.root.marginX,
      borderRadius: menuItemVars.base.pressed.root.cornerRadius,
      backgroundColor: menuItemVars.base.pressed.root.color,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: menuItemVars.base.enabled.root.colorDuration,
      transitionTimingFunction: menuItemVars.base.enabled.root.colorTimingFunction,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      minWidth: 0,
      gap: menuItemVars.base.enabled.body.gap,
    },
    label: {
      fontWeight: menuItemVars.base.enabled.label.fontWeight,
    },
    description: {
      fontWeight: menuItemVars.base.enabled.description.fontWeight,
      color: menuItemVars.base.enabled.description.color,
    },
    prefixIcon: {
      flexShrink: 0,
    },
    suffixIcon: {
      flexShrink: 0,
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          paddingTop: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingLeft: menuItemVars.sizeMedium.enabled.root.paddingX,
          paddingRight: menuItemVars.sizeMedium.enabled.root.paddingX,
          gap: menuItemVars.sizeMedium.enabled.root.gap,
        },
        label: {
          fontSize: menuItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.description.lineHeight,
        },
        prefixIcon: {
          width: menuItemVars.sizeMedium.enabled.prefixIcon.size,
          height: menuItemVars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: menuItemVars.sizeMedium.enabled.suffixIcon.size,
          height: menuItemVars.sizeMedium.enabled.suffixIcon.size,
        },
      },
      small: {
        root: {
          paddingTop: menuItemVars.sizeSmall.enabled.root.paddingY,
          paddingBottom: menuItemVars.sizeSmall.enabled.root.paddingY,
          paddingLeft: menuItemVars.sizeSmall.enabled.root.paddingX,
          paddingRight: menuItemVars.sizeSmall.enabled.root.paddingX,
          gap: menuItemVars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: menuItemVars.sizeSmall.enabled.label.fontSize,
          lineHeight: menuItemVars.sizeSmall.enabled.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeSmall.enabled.description.fontSize,
          lineHeight: menuItemVars.sizeSmall.enabled.description.lineHeight,
        },
        prefixIcon: {
          width: menuItemVars.sizeSmall.enabled.prefixIcon.size,
          height: menuItemVars.sizeSmall.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: menuItemVars.sizeSmall.enabled.suffixIcon.size,
          height: menuItemVars.sizeSmall.enabled.suffixIcon.size,
        },
      },
    },
    tone: {
      neutral: {},
      critical: {},
    },
    disabled: {
      true: {
        label: { color: menuItemVars.base.disabled.label.color },
        description: { color: menuItemVars.base.disabled.description.color },
        prefixIcon: { color: menuItemVars.base.disabled.prefixIcon.color },
        suffixIcon: { color: menuItemVars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
    pressed: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: "neutral",
      disabled: false,
      css: {
        label: { color: menuItemVars.toneNeutral.enabled.label.color },
        prefixIcon: { color: menuItemVars.toneNeutral.enabled.prefixIcon.color },
        suffixIcon: { color: menuItemVars.toneNeutral.enabled.suffixIcon.color },
      },
    },
    {
      tone: "critical",
      disabled: false,
      css: {
        label: { color: menuItemVars.toneCritical.enabled.label.color },
        prefixIcon: { color: menuItemVars.toneCritical.enabled.prefixIcon.color },
        suffixIcon: { color: menuItemVars.toneCritical.enabled.suffixIcon.color },
      },
    },
    {
      pressed: true,
      disabled: false,
      css: {
        pressedOverlay: { opacity: 1 },
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    tone: "neutral",
    disabled: false,
    pressed: false,
  },
});

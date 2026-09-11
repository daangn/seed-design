import {
  select as selectVars,
  selectItem as selectItemVars,
  selectTrigger as selectTriggerVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export const selectTrigger = defineSlotRecipe({
  name: "select-trigger",
  slots: ["root", "pressedOverlay", "value", "placeholder", "prefixIcon", "suffixIcon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      overflow: "hidden",
      backgroundColor: selectTriggerVars.base.enabled.root.color,
      borderStyle: "solid",
      borderWidth: selectTriggerVars.base.enabled.root.strokeWidth,
      borderColor: selectTriggerVars.base.enabled.root.strokeColor,
    },
    pressedOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0,
      backgroundColor: selectTriggerVars.base.pressed.root.color,
      transitionProperty: "opacity",
      transitionDuration: selectTriggerVars.base.enabled.root.colorDuration,
      transitionTimingFunction: selectTriggerVars.base.enabled.root.colorTimingFunction,
      pointerEvents: "none",
    },
    value: {
      flexGrow: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: selectTriggerVars.base.enabled.value.color,
      fontWeight: selectTriggerVars.base.enabled.value.fontWeight,
      pointerEvents: "none",
    },
    placeholder: {
      flexGrow: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: selectTriggerVars.base.enabled.placeholder.color,
      fontWeight: selectTriggerVars.base.enabled.placeholder.fontWeight,
      pointerEvents: "none",
    },
    prefixIcon: {
      flexShrink: 0,
      color: selectTriggerVars.base.enabled.prefixIcon.color,
      pointerEvents: "none",
    },
    suffixIcon: {
      flexShrink: 0,
      color: selectTriggerVars.base.enabled.suffixIcon.color,
      transform: "rotate(0deg)",
      transitionProperty: "transform",
      transitionDuration: selectTriggerVars.base.enabled.suffixIcon.closeRotateDuration,
      transitionTimingFunction: selectTriggerVars.base.enabled.suffixIcon.closeRotateTimingFunction,
      pointerEvents: "none",
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: selectTriggerVars.sizeLarge.enabled.root.height,
          gap: selectTriggerVars.sizeLarge.enabled.root.gap,
          paddingLeft: selectTriggerVars.sizeLarge.enabled.root.paddingX,
          paddingRight: selectTriggerVars.sizeLarge.enabled.root.paddingX,
          borderRadius: selectTriggerVars.sizeLarge.enabled.root.cornerRadius,
        },
        pressedOverlay: { borderRadius: selectTriggerVars.sizeLarge.enabled.root.cornerRadius },
        value: {
          fontSize: selectTriggerVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
        },
      },
      medium: {
        root: {
          height: selectTriggerVars.sizeMedium.enabled.root.height,
          gap: selectTriggerVars.sizeMedium.enabled.root.gap,
          paddingLeft: selectTriggerVars.sizeMedium.enabled.root.paddingX,
          paddingRight: selectTriggerVars.sizeMedium.enabled.root.paddingX,
          borderRadius: selectTriggerVars.sizeMedium.enabled.root.cornerRadius,
        },
        pressedOverlay: { borderRadius: selectTriggerVars.sizeMedium.enabled.root.cornerRadius },
        value: {
          fontSize: selectTriggerVars.sizeMedium.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
        },
      },
    },
    disabled: {
      true: {
        root: { backgroundColor: selectTriggerVars.base.disabled.root.color },
        value: { color: selectTriggerVars.base.disabled.value.color },
        placeholder: { color: selectTriggerVars.base.disabled.placeholder.color },
        prefixIcon: { color: selectTriggerVars.base.disabled.prefixIcon.color },
        suffixIcon: { color: selectTriggerVars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
    readOnly: {
      true: {
        root: { backgroundColor: selectTriggerVars.base.readonly.root.color },
        value: { color: selectTriggerVars.base.readonly.value.color },
        placeholder: { color: selectTriggerVars.base.readonly.placeholder.color },
      },
      false: {},
    },
    invalid: {
      true: {
        root: {
          borderWidth: selectTriggerVars.base.invalid.root.strokeWidth,
          borderColor: selectTriggerVars.base.invalid.root.strokeColor,
        },
      },
      false: {},
    },
    open: {
      true: {
        suffixIcon: {
          transform: "rotate(180deg)",
          transitionDuration: selectTriggerVars.base.enabled.suffixIcon.openRotateDuration,
          transitionTimingFunction:
            selectTriggerVars.base.enabled.suffixIcon.openRotateTimingFunction,
        },
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
      pressed: true,
      disabled: false,
      readOnly: false,
      css: { pressedOverlay: { opacity: 1 } },
    },
  ],
  defaultVariants: {
    size: "large",
    disabled: false,
    readOnly: false,
    invalid: false,
    open: false,
    pressed: false,
  },
});

export const select = defineSlotRecipe({
  name: "select",
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
      borderRadius: selectVars.base.enabled.root.cornerRadius,
      backgroundColor: selectVars.base.enabled.root.color,
      boxShadow: selectVars.base.enabled.root.shadow,
      overflow: "hidden",
      transitionProperty: "opacity, transform",
    },
    scrollArea: {
      width: "100%",
      maxHeight: selectVars.base.enabled.root.maxHeight,
    },
    scrollContent: {
      display: "flex",
      flexDirection: "column",
      paddingTop: selectVars.base.enabled.root.paddingY,
      paddingBottom: selectVars.base.enabled.root.paddingY,
      gap: selectVars.base.enabled.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    },
    groupLabel: {
      color: selectVars.base.enabled.groupLabel.color,
      flexShrink: 0,
    },
    separator: {
      height: selectVars.base.enabled.divider.height,
      flexShrink: 0,
      marginLeft: selectVars.base.enabled.divider.marginX,
      marginRight: selectVars.base.enabled.divider.marginX,
      marginBottom: selectVars.base.enabled.root.gap,
      backgroundColor: selectVars.base.enabled.divider.color,
    },
  },
  variants: {
    size: {
      large: {
        groupLabel: {
          paddingTop: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingBottom: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          paddingRight: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,
        },
      },
      medium: {
        groupLabel: {
          paddingTop: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingBottom: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeMedium.enabled.groupLabel.paddingX,
          paddingRight: selectVars.sizeMedium.enabled.groupLabel.paddingX,
          fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
      },
    },
    open: {
      true: {
        content: {
          opacity: 1,
          transform: "scale(1)",
          transitionDuration: selectVars.base.enabled.root.enterDuration,
          transitionTimingFunction: selectVars.base.enabled.root.enterTimingFunction,
        },
      },
      false: {
        content: {
          opacity: selectVars.base.enabled.root.exitOpacity,
          transform: `scale(${selectVars.base.enabled.root.exitScale})`,
          transitionDuration: selectVars.base.enabled.root.exitDuration,
          transitionTimingFunction: selectVars.base.enabled.root.exitTimingFunction,
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
          opacity: selectVars.base.enabled.root.enterOpacity,
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
          animationDuration: selectVars.base.enabled.root.enterDuration,
          animationTimingFunction: selectVars.base.enabled.root.enterTimingFunction,
          "--seed-enter-opacity": selectVars.base.enabled.root.enterOpacity,
          "--seed-enter-scale": selectVars.base.enabled.root.enterScale,
        },
      },
    },
  ],
  defaultVariants: {
    size: "large",
    open: false,
    positioned: false,
  },
});

export const selectItem = defineSlotRecipe({
  name: "select-item",
  slots: ["root", "pressedOverlay", "body", "label", "description", "prefixIcon", "indicator"],
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
      right: selectItemVars.base.pressed.root.marginX,
      bottom: 0,
      left: selectItemVars.base.pressed.root.marginX,
      borderRadius: selectItemVars.base.enabled.root.cornerRadius,
      backgroundColor: selectItemVars.base.pressed.root.color,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: selectItemVars.base.enabled.root.colorDuration,
      transitionTimingFunction: selectItemVars.base.enabled.root.colorTimingFunction,
      pointerEvents: "none",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      minWidth: 0,
      gap: selectItemVars.base.enabled.body.gap,
    },
    label: {
      color: selectItemVars.base.enabled.label.color,
      fontWeight: selectItemVars.base.enabled.label.fontWeight,
    },
    description: {
      color: selectItemVars.base.enabled.description.color,
      fontWeight: selectItemVars.base.enabled.description.fontWeight,
    },
    prefixIcon: {
      flexShrink: 0,
      color: selectItemVars.base.enabled.prefixIcon.color,
    },
    indicator: {
      flexShrink: 0,
      color: selectItemVars.base.enabled.indicator.color,
    },
  },
  variants: {
    size: {
      large: {
        root: {
          paddingTop: selectItemVars.sizeLarge.enabled.root.paddingY,
          paddingBottom: selectItemVars.sizeLarge.enabled.root.paddingY,
          paddingLeft: selectItemVars.base.enabled.root.paddingX,
          paddingRight: selectItemVars.base.enabled.root.paddingX,
          gap: selectItemVars.sizeLarge.enabled.root.gap,
        },
        prefixIcon: {
          width: selectItemVars.sizeLarge.enabled.prefixIcon.size,
          height: selectItemVars.sizeLarge.enabled.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeLarge.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeLarge.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeLarge.enabled.indicator.size,
          height: selectItemVars.sizeLarge.enabled.indicator.size,
        },
      },
      medium: {
        root: {
          paddingTop: selectItemVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: selectItemVars.sizeMedium.enabled.root.paddingY,
          paddingLeft: selectItemVars.base.enabled.root.paddingX,
          paddingRight: selectItemVars.base.enabled.root.paddingX,
          gap: selectItemVars.sizeMedium.enabled.root.gap,
        },
        prefixIcon: {
          width: selectItemVars.sizeMedium.enabled.prefixIcon.size,
          height: selectItemVars.sizeMedium.enabled.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeMedium.enabled.indicator.size,
          height: selectItemVars.sizeMedium.enabled.indicator.size,
        },
      },
    },
    disabled: {
      true: {
        prefixIcon: { color: selectItemVars.base.disabled.prefixIcon.color },
        label: { color: selectItemVars.base.disabled.label.color },
        description: { color: selectItemVars.base.disabled.description.color },
        indicator: { color: selectItemVars.base.disabled.indicator.color },
      },
      false: {},
    },
    selected: {
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
      pressed: true,
      disabled: false,
      css: { pressedOverlay: { opacity: 1 } },
    },
  ],
  defaultVariants: {
    size: "large",
    disabled: false,
    selected: false,
    pressed: false,
  },
});

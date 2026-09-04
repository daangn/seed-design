import { inputButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const inputButton = defineSlotRecipe({
  name: "input-button",
  slots: [
    "root",
    "button",
    "baseStroke",
    "stroke",
    "value",
    "placeholder",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
    "clearButton",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    button: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: vars.base.enabled.root.color,
    },
    baseStroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderStyle: "solid",
      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,
      pointerEvents: "none",
    },
    stroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderStyle: "solid",
      borderWidth: vars.base.invalid.root.strokeWidth,
      borderColor: "transparent",
      transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,
      pointerEvents: "none",
    },
    value: {
      flexGrow: 1,
      minWidth: 0,
      color: vars.base.enabled.value.color,
      fontWeight: vars.base.enabled.value.fontWeight,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
    placeholder: {
      flexGrow: 1,
      minWidth: 0,
      color: vars.base.enabled.placeholder.color,
      fontWeight: vars.base.enabled.placeholder.fontWeight,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
    prefixText: {
      flexShrink: 0,
      color: vars.base.enabled.prefixText.color,
      fontWeight: vars.base.enabled.prefixText.fontWeight,
      pointerEvents: "none",
    },
    prefixIcon: {
      flexShrink: 0,
      color: vars.base.enabled.prefixIcon.color,
      pointerEvents: "none",
    },
    suffixText: {
      flexShrink: 0,
      color: vars.base.enabled.suffixText.color,
      fontWeight: vars.base.enabled.suffixText.fontWeight,
      pointerEvents: "none",
    },
    suffixIcon: {
      flexShrink: 0,
      color: vars.base.enabled.suffixIcon.color,
      pointerEvents: "none",
    },
    clearButton: {
      flexShrink: 0,
      color: vars.base.enabled.clearButton.color,
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          gap: vars.sizeLarge.enabled.root.gap,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
        button: { borderRadius: vars.sizeLarge.enabled.root.cornerRadius },
        baseStroke: { borderRadius: vars.sizeLarge.enabled.root.cornerRadius },
        stroke: { borderRadius: vars.sizeLarge.enabled.root.cornerRadius },
        value: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: vars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeLarge.enabled.suffixIcon.size,
          height: vars.sizeLarge.enabled.suffixIcon.size,
        },
        clearButton: {
          width: vars.sizeLarge.enabled.clearButton.size,
          height: vars.sizeLarge.enabled.clearButton.size,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          gap: vars.sizeMedium.enabled.root.gap,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
        button: { borderRadius: vars.sizeMedium.enabled.root.cornerRadius },
        baseStroke: { borderRadius: vars.sizeMedium.enabled.root.cornerRadius },
        stroke: { borderRadius: vars.sizeMedium.enabled.root.cornerRadius },
        value: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: vars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeMedium.enabled.prefixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMedium.enabled.prefixIcon.size,
          height: vars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeMedium.enabled.suffixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeMedium.enabled.suffixIcon.size,
          height: vars.sizeMedium.enabled.suffixIcon.size,
        },
        clearButton: {
          width: vars.sizeMedium.enabled.clearButton.size,
          height: vars.sizeMedium.enabled.clearButton.size,
        },
      },
    },
    pressed: {
      true: {
        button: { backgroundColor: vars.base.pressed.root.color },
      },
      false: {},
    },
    invalid: {
      true: {
        stroke: { borderColor: vars.base.invalid.root.strokeColor },
      },
      false: {},
    },
    disabled: {
      true: {
        button: { backgroundColor: vars.base.disabled.root.color },
        value: { color: vars.base.disabled.value.color },
        placeholder: { color: vars.base.disabled.placeholder.color },
        prefixText: { color: vars.base.disabled.prefixText.color },
        prefixIcon: { color: vars.base.disabled.prefixIcon.color },
        suffixText: { color: vars.base.disabled.suffixText.color },
        suffixIcon: { color: vars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
    readOnly: {
      true: {
        button: { backgroundColor: vars.base.readonly.root.color },
        value: { color: vars.base.readonly.value.color },
        placeholder: { color: vars.base.readonly.placeholder.color },
      },
      false: {},
    },
  },
  defaultVariants: {
    size: "large",
    pressed: false,
    invalid: false,
    disabled: false,
    readOnly: false,
  },
});

export default inputButton;

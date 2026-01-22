import { inputButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, active, focus, invalid, not, readOnly } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";

const inputButton = defineSlotRecipe({
  name: "input-button",
  slots: [
    "root",
    "value",
    "placeholder",
    "button",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
    "clearButton",
  ],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",

      boxSizing: "border-box",

      position: "relative",
      isolation: "isolate",

      height: vars.base.enabled.root.height,
      gap: vars.base.enabled.root.gap,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
    },
    button: {
      position: "absolute",
      zIndex: -1,

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      cursor: "pointer",

      border: "none",
      padding: 0,

      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,

      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: vars.base.invalid.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo("[data-disabled]")]: {
        cursor: "not-allowed",
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(not("[data-disabled]"), not(readOnly), active)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        cursor: "default",
        backgroundColor: vars.base.readonly.root.color,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(invalid, "::after")]: {
        borderWidth: vars.base.invalid.root.strokeWidth,
        borderColor: vars.base.invalid.root.strokeColor,
      },
    },
    value: {
      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,
      fontWeight: vars.base.enabled.value.fontWeight,

      color: vars.base.enabled.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.value.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.value.color,
      },
    },
    placeholder: {
      fontSize: vars.base.enabled.placeholder.fontSize,
      lineHeight: vars.base.enabled.placeholder.lineHeight,
      fontWeight: vars.base.enabled.placeholder.fontWeight,

      color: vars.base.enabled.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.placeholder.color,
      },
    },
    prefixText: {
      fontSize: vars.base.enabled.prefixText.fontSize,
      lineHeight: vars.base.enabled.prefixText.lineHeight,
      fontWeight: vars.base.enabled.prefixText.fontWeight,

      color: vars.base.enabled.prefixText.color,

      pointerEvents: "none",
    },
    prefixIcon: {
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      flexShrink: 0,

      color: vars.base.enabled.prefixIcon.color,

      pointerEvents: "none",
    },
    suffixText: {
      fontSize: vars.base.enabled.suffixText.fontSize,
      lineHeight: vars.base.enabled.suffixText.lineHeight,
      fontWeight: vars.base.enabled.suffixText.fontWeight,

      color: vars.base.enabled.suffixText.color,

      pointerEvents: "none",
    },
    suffixIcon: {
      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,
      flexShrink: 0,

      color: vars.base.enabled.suffixIcon.color,

      pointerEvents: "none",
    },
    clearButton: {
      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",

      padding: 0,

      ...onlyIcon({
        size: vars.base.enabled.clearButton.size,
        color: vars.base.enabled.clearButton.color,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default inputButton;

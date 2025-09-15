import { fieldButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, disabled, focus, invalid } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";

const fieldButton = defineSlotRecipe({
  name: "field-button",
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
      // for the clear button
      zIndex: 0,

      minHeight: vars.base.enabled.root.minHeight,
      borderRadius: vars.base.enabled.root.cornerRadius,
      gap: vars.base.enabled.root.gap,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,

      backgroundColor: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(invalid)]: {
        boxShadow: `inset 0 0 0 ${vars.base.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
      },
    },
    button: {
      position: "absolute",
      inset: 0,

      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    value: {
      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,

      color: vars.base.enabled.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,
      },
    },
    placeholder: {
      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,

      color: vars.base.enabled.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      [pseudo(disabled)]: {
        color: vars.base.disabled.placeholder.color,
      },
    },
    prefixText: {
      fontSize: vars.base.enabled.prefixText.fontSize,
      lineHeight: vars.base.enabled.prefixText.lineHeight,

      color: vars.base.enabled.prefixText.color,
    },
    prefixIcon: {
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      flexShrink: 0,

      color: vars.base.enabled.prefixIcon.color,
    },
    suffixText: {
      fontSize: vars.base.enabled.suffixText.fontSize,
      lineHeight: vars.base.enabled.suffixText.lineHeight,

      color: vars.base.enabled.suffixText.color,
    },
    suffixIcon: {
      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,
      flexShrink: 0,

      color: vars.base.enabled.suffixIcon.color,
    },
    clearButton: {
      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",

      // relies on `position: relative` of root for creating a stacking context
      zIndex: 1,

      ...onlyIcon({
        size: vars.base.enabled.clearButton.size,
        color: vars.base.enabled.clearButton.color,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default fieldButton;

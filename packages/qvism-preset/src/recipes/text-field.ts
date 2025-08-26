import { textField as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const textField = defineSlotRecipe({
  name: "text-field",
  slots: ["root", "value", "prefixText", "prefixIcon", "suffixText", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      width: "100%",

      alignItems: "center",

      minHeight: vars.base.enabled.root.minHeight,
      borderRadius: vars.base.enabled.root.cornerRadius,
      gap: vars.base.enabled.root.gap,

      backgroundColor: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      overflow: "hidden",

      [pseudo(not(readOnly), focus)]: {
        backgroundColor: vars.base.focused.root.color,
        boxShadow: `inset 0 0 0 ${vars.base.focused.root.strokeWidth} ${vars.base.focused.root.strokeColor}`,
      },

      [pseudo(invalid)]: {
        boxShadow: `inset 0 0 0 ${vars.base.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
      },

      [pseudo(invalid, focus)]: {
        boxShadow: `inset 0 0 0 ${vars.base.invalid.root.strokeWidth} ${vars.base.invalidFocused.root.strokeColor}`,
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.root.color,
      },

      // [pseudo(readOnly)]: {
      //   backgroundColor: vars.base.readonly.root.color,
      // },
    },
    value: {
      boxSizing: "border-box",
      font: "inherit",

      // We intentionally apply root's paddingY to value for input touch area.
      paddingBlock: vars.base.enabled.root.paddingY,

      [pseudo(":first-child")]: {
        paddingInlineStart: vars.base.enabled.root.paddingX,
      },

      [pseudo(":last-child")]: {
        paddingInlineEnd: vars.base.enabled.root.paddingX,
      },

      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,

      [pseudo(":is(input)")]: {
        paddingInline: 0,
      },

      [pseudo(":is(textarea)")]: {
        paddingInline: 0,

        minHeight: "90px",
      },

      background: "none",
      border: "none",
      outline: "none",
      resize: "none",
      flexGrow: 1,
      height: "100%",

      color: vars.base.enabled.value.color,

      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,
      },

      [pseudo(disabled, "::placeholder")]: {
        color: vars.base.disabled.placeholder.color,
      },
    },
    prefixText: {
      color: vars.base.enabled.prefixText.color,

      fontSize: vars.base.enabled.prefixText.fontSize,
      lineHeight: vars.base.enabled.prefixText.lineHeight,

      [pseudo(":first-child")]: {
        marginInlineStart: vars.base.enabled.root.paddingX,
      },
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,

      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,

      [pseudo(":first-child")]: {
        marginInlineStart: vars.base.enabled.root.paddingX,
      },
    },
    suffixText: {
      color: vars.base.enabled.suffixText.color,

      fontSize: vars.base.enabled.suffixText.fontSize,
      lineHeight: vars.base.enabled.suffixText.lineHeight,

      [pseudo(":last-child")]: {
        marginInlineEnd: vars.base.enabled.root.paddingX,
      },
    },
    suffixIcon: {
      color: vars.base.enabled.suffixIcon.color,
      flexShrink: 0,

      width: vars.base.enabled.suffixIcon.size,
      height: vars.base.enabled.suffixIcon.size,

      [pseudo(":last-child")]: {
        marginInlineEnd: vars.base.enabled.root.paddingX,
      },
    },
  },
  defaultVariants: {},
  variants: {},
});

export default textField;

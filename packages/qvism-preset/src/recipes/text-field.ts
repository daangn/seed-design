import { textField as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const textField = defineSlotRecipe({
  name: "text-field",
  slots: ["root", "value", "prefixText", "prefixIcon", "suffixText", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      backgroundColor: vars.base.enabled.field.color,
      borderStyle: "solid",
      borderWidth: vars.base.enabled.field.strokeWidth,
      borderColor: vars.base.enabled.field.strokeColor,

      [pseudo(not(readOnly), focus)]: {
        borderColor: vars.base.focused.field.strokeColor,
      },

      [pseudo(invalid)]: {
        backgroundColor: vars.base.invalid.field.color,
        borderColor: vars.base.invalid.field.strokeColor,
      },

      [pseudo(invalid, focus)]: {
        backgroundColor: vars.base.invalidFocused.field.color,
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.field.color,
      },

      [pseudo(readOnly)]: {
        backgroundColor: vars.base.readonly.field.color,
      },
    },
    prefixText: {
      color: vars.base.enabled.prefixText.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,

      [pseudo(disabled)]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixText: {
      color: vars.base.enabled.suffixText.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixText.color,
      },
    },
    suffixIcon: {
      color: vars.base.enabled.suffixIcon.color,
      flexShrink: 0,

      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixIcon.color,
      },
    },
    value: {
      boxSizing: "border-box",
      font: "inherit",

      [pseudo(":is(input)")]: {
        paddingInline: 0,
      },

      [pseudo(":is(textarea)")]: {
        paddingInline: 0,

        minHeight: "90px",
        width: "100%",
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
  },
  defaultVariants: {
    size: "large",
  },
  variants: {
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.field.minHeight,
          borderRadius: vars.sizeLarge.enabled.field.cornerRadius,
          gap: vars.sizeLarge.enabled.field.gap,

          paddingInline: vars.sizeLarge.enabled.field.paddingX,
        },
        value: {
          // We intentionally apply field's paddingY to value for input touch area.
          paddingBlock: vars.sizeLarge.enabled.field.paddingY,

          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
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
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.field.minHeight,
          borderRadius: vars.sizeMedium.enabled.field.cornerRadius,
          gap: vars.sizeMedium.enabled.field.gap,

          paddingInline: vars.sizeMedium.enabled.field.paddingX,
        },
        value: {
          // We intentionally apply field's paddingY to value for input touch area.
          paddingBlock: vars.sizeMedium.enabled.field.paddingY,

          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
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
      },
    },
  },
});

export default textField;

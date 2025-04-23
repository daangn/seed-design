import { defineSlotRecipe } from "../utils/define";
import { prefixIcon, suffixIcon } from "../utils/icon";
import { disabled, focus, invalid, not, pseudo, readOnly } from "../utils/pseudo";
import { textField as vars } from "../vars/component";

const textInput = defineSlotRecipe({
  name: "text-input",
  slots: ["root", "value"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      backgroundColor: vars.base.enabled.field.color,
      color: vars.base.enabled.value.color,
      borderStyle: "solid",
      borderWidth: vars.base.enabled.field.strokeWidth,
      borderColor: vars.base.enabled.field.strokeColor,

      ...prefixIcon({
        color: vars.base.enabled.prefixIcon.color,
      }),
      ...suffixIcon({
        color: vars.base.enabled.suffixIcon.color,
      }),

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
        color: vars.base.disabled.value.color,

        ...prefixIcon({
          color: vars.base.disabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: vars.base.disabled.suffixIcon.color,
        }),
      },

      [pseudo(readOnly)]: {
        backgroundColor: vars.base.readonly.field.color,
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

          ...prefixIcon({
            size: vars.sizeLarge.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeLarge.enabled.suffixIcon.size,
          }),
        },
        value: {
          // We intentionally apply field's paddingY to value for input touch area.
          paddingBlock: vars.sizeLarge.enabled.field.paddingY,

          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.field.minHeight,
          borderRadius: vars.sizeMedium.enabled.field.cornerRadius,
          gap: vars.sizeMedium.enabled.field.gap,

          paddingInline: vars.sizeMedium.enabled.field.paddingX,

          ...prefixIcon({
            size: vars.sizeMedium.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: vars.sizeMedium.enabled.suffixIcon.size,
          }),
        },
        value: {
          // We intentionally apply field's paddingY to value for input touch area.
          paddingBlock: vars.sizeMedium.enabled.field.paddingY,

          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
      },
    },
  },
});

export default textInput;

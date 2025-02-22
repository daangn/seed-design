import { textField as vars } from "@seed-design/css/vars/component";
import { defineRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const textField = defineRecipe({
  name: "text-field",
  slots: [
    "root",
    "header",
    "label",
    "indicator",
    "field",
    "value",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
    "footer",
    "description",
    "errorMessage",
    "errorIcon",
    "characterCountArea",
    "characterCount",
    "maxCharacterCount",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",

      width: "100%",
    },
    header: {},
    label: {
      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    indicator: {
      color: vars.base.enabled.indicator.color,
      fontWeight: vars.base.enabled.indicator.fontWeight,
    },
    field: {
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
    footer: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    description: {
      fontWeight: vars.base.enabled.description.fontWeight,
      color: vars.base.enabled.description.color,
    },
    errorMessage: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",

      color: vars.base.enabled.errorMessage.color,
    },
    errorIcon: {
      flex: "none",
      flexShrink: 0,
    },
    characterCountArea: {
      display: "flex",
      flex: "none",
      marginInlineStart: "auto",
    },
    characterCount: {
      color: vars.base.enabled.characterCount.color,
      fontWeight: vars.base.enabled.characterCount.fontWeight,
      [pseudo("[data-empty]")]: {
        color: vars.base.enabled.maxCharacterCount.color,
      },
    },
    maxCharacterCount: {
      color: vars.base.enabled.maxCharacterCount.color,
      fontWeight: vars.base.enabled.maxCharacterCount.fontWeight,
    },
  },
  defaultVariants: {
    size: "medium",
  },
  variants: {
    size: {
      xlarge: {
        header: {
          paddingBottom: vars.sizeXlarge.enabled.header.paddingBottom,
          gap: vars.sizeXlarge.enabled.header.gap,
        },
        label: {
          fontSize: vars.sizeXlarge.enabled.label.fontSize,
          lineHeight: vars.sizeXlarge.enabled.label.lineHeight,
        },
        indicator: {
          fontSize: vars.sizeXlarge.enabled.indicator.fontSize,
          lineHeight: vars.sizeXlarge.enabled.indicator.lineHeight,
        },
        field: {
          minHeight: vars.sizeXlarge.enabled.field.minHeight,
          borderRadius: vars.sizeXlarge.enabled.field.cornerRadius,
          gap: vars.sizeXlarge.enabled.field.gap,

          paddingInline: vars.sizeXlarge.enabled.field.paddingX,
        },
        value: {
          // We intentionally apply field's paddingY to value for input touch area.
          paddingBlock: vars.sizeXlarge.enabled.field.paddingY,

          fontSize: vars.sizeXlarge.enabled.value.fontSize,
          lineHeight: vars.sizeXlarge.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeXlarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeXlarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeXlarge.enabled.prefixIcon.size,
          height: vars.sizeXlarge.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeXlarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeXlarge.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeXlarge.enabled.suffixIcon.size,
          height: vars.sizeXlarge.enabled.suffixIcon.size,
        },
        footer: {
          gap: vars.sizeXlarge.enabled.footer.gap,
          paddingTop: vars.sizeXlarge.enabled.footer.paddingTop,
          minHeight: vars.sizeXlarge.enabled.footer.minHeight,
        },
        description: {
          fontSize: vars.sizeXlarge.enabled.description.fontSize,
          lineHeight: vars.sizeXlarge.enabled.description.lineHeight,
        },
        errorMessage: {
          fontSize: vars.sizeXlarge.enabled.errorMessage.fontSize,
          lineHeight: vars.sizeXlarge.enabled.errorMessage.lineHeight,
        },
        errorIcon: {
          width: vars.sizeXlarge.enabled.errorIcon.size,
          height: vars.sizeXlarge.enabled.errorIcon.size,
          marginRight: vars.sizeXlarge.enabled.errorIcon.marginRight,
        },
        characterCount: {
          fontSize: vars.sizeXlarge.enabled.characterCount.fontSize,
          lineHeight: vars.sizeXlarge.enabled.characterCount.lineHeight,
        },
        maxCharacterCount: {
          fontSize: vars.sizeXlarge.enabled.maxCharacterCount.fontSize,
          lineHeight: vars.sizeXlarge.enabled.maxCharacterCount.lineHeight,
        },
      },
      large: {
        header: {
          paddingBottom: vars.sizeLarge.enabled.header.paddingBottom,
          gap: vars.sizeLarge.enabled.header.gap,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        indicator: {
          fontSize: vars.sizeLarge.enabled.indicator.fontSize,
          lineHeight: vars.sizeLarge.enabled.indicator.lineHeight,
        },
        field: {
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
        footer: {
          gap: vars.sizeLarge.enabled.footer.gap,
          paddingTop: vars.sizeLarge.enabled.footer.paddingTop,
          minHeight: vars.sizeLarge.enabled.footer.minHeight,
        },
        description: {
          fontSize: vars.sizeLarge.enabled.description.fontSize,
          lineHeight: vars.sizeLarge.enabled.description.lineHeight,
        },
        errorMessage: {
          fontSize: vars.sizeLarge.enabled.errorMessage.fontSize,
          lineHeight: vars.sizeLarge.enabled.errorMessage.lineHeight,
        },
        errorIcon: {
          width: vars.sizeLarge.enabled.errorIcon.size,
          height: vars.sizeLarge.enabled.errorIcon.size,
          marginRight: vars.sizeLarge.enabled.errorIcon.marginRight,
        },
        characterCount: {
          fontSize: vars.sizeLarge.enabled.characterCount.fontSize,
          lineHeight: vars.sizeLarge.enabled.characterCount.lineHeight,
        },
        maxCharacterCount: {
          fontSize: vars.sizeLarge.enabled.maxCharacterCount.fontSize,
          lineHeight: vars.sizeLarge.enabled.maxCharacterCount.lineHeight,
        },
      },
      medium: {
        header: {
          paddingBottom: vars.sizeMedium.enabled.header.paddingBottom,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        indicator: {
          fontSize: vars.sizeMedium.enabled.indicator.fontSize,
          lineHeight: vars.sizeMedium.enabled.indicator.lineHeight,
        },
        field: {
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
        footer: {
          gap: vars.sizeMedium.enabled.footer.gap,
          paddingTop: vars.sizeMedium.enabled.footer.paddingTop,
          minHeight: vars.sizeMedium.enabled.footer.minHeight,
        },
        description: {
          fontSize: vars.sizeMedium.enabled.description.fontSize,
          lineHeight: vars.sizeMedium.enabled.description.lineHeight,
        },
        errorMessage: {
          fontSize: vars.sizeMedium.enabled.errorMessage.fontSize,
          lineHeight: vars.sizeMedium.enabled.errorMessage.lineHeight,
        },
        errorIcon: {
          width: vars.sizeMedium.enabled.errorIcon.size,
          height: vars.sizeMedium.enabled.errorIcon.size,
          marginRight: vars.sizeMedium.enabled.errorIcon.marginRight,
        },
        characterCount: {
          fontSize: vars.sizeMedium.enabled.characterCount.fontSize,
          lineHeight: vars.sizeMedium.enabled.characterCount.lineHeight,
        },
        maxCharacterCount: {
          fontSize: vars.sizeMedium.enabled.maxCharacterCount.fontSize,
          lineHeight: vars.sizeMedium.enabled.maxCharacterCount.lineHeight,
        },
      },
    },
  },
});

export default textField;

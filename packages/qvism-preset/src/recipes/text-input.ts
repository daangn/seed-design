import { textInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const textInput = defineSlotRecipe({
  name: "text-input",
  slots: ["root", "value", "prefixText", "prefixIcon", "suffixText", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      overflow: "hidden",

      gap: vars.base.enabled.root.gap,

      // strokeColor transition duration & timing function values are the same as strokeWidth transition values
      transition: `box-shadow ${vars.base.enabled.root.strokeColorDuration} ${vars.base.enabled.root.strokeColorTimingFunction}`,
    },
    value: {
      boxSizing: "border-box",
      font: "inherit",

      background: "none",
      border: "none",
      outline: "none",
      resize: "none",
      flexGrow: 1,
      alignSelf: "stretch",

      color: vars.base.enabled.value.color,

      fontWeight: vars.base.enabled.value.fontWeight,

      paddingInline: 0,

      [pseudo(":is(input)")]: {
        // browser sets the default width of inputs based on the 'size' prop of the input (e.g. <input size="20" />)
        // this sets the width to 0 to prevent any overflow and fill the available space of the parent flex container
        // note: this only works with flexGrow: 1
        width: 0,
      },

      [pseudo(":is(textarea)")]: {
        minHeight: vars.typeMultiline.enabled.root.minHeight,
        paddingBlock: vars.typeMultiline.enabled.root.paddingY,
      },

      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
        fontWeight: vars.base.enabled.placeholder.fontWeight,
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,
      },

      [pseudo(disabled, "::placeholder")]: {
        color: vars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly)]: {
        color: vars.base.readonly.value.color,
      },

      [pseudo(readOnly, "::placeholder")]: {
        color: vars.base.readonly.placeholder.color,
      },
    },
    prefixText: {
      color: vars.base.enabled.prefixText.color,
      fontWeight: vars.base.enabled.prefixText.fontWeight,
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,
    },
    suffixText: {
      color: vars.base.enabled.suffixText.color,
      fontWeight: vars.base.enabled.suffixText.fontWeight,
    },
    suffixIcon: {
      color: vars.base.enabled.suffixIcon.color,
      flexShrink: 0,
    },
  },
  defaultVariants: {
    variant: "outline",
  },
  variants: {
    variant: {
      outline: {
        root: {
          minHeight: vars.variantOutline.enabled.root.minHeight,
          borderRadius: vars.variantOutline.enabled.root.cornerRadius,

          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

          [pseudo(not(readOnly), focus)]: {
            boxShadow: `inset 0 0 0 ${vars.variantOutline.focused.root.strokeWidth} ${vars.base.focused.root.strokeColor}`,
          },

          [pseudo(invalid)]: {
            boxShadow: `inset 0 0 0 ${vars.variantOutline.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
          },

          [pseudo(invalid, focus)]: {
            boxShadow: `inset 0 0 0 ${vars.variantOutline.invalid.root.strokeWidth} ${vars.base.invalidFocused.root.strokeColor}`,
          },

          [pseudo(disabled)]: {
            backgroundColor: vars.variantOutline.disabled.root.color,
          },
        },
        value: {
          fontSize: vars.variantOutline.enabled.value.fontSize,
          lineHeight: vars.variantOutline.enabled.value.lineHeight,

          [pseudo(":first-child")]: {
            paddingInlineStart: vars.variantOutline.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutline.enabled.placeholder.fontSize,
            lineHeight: vars.variantOutline.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantOutline.enabled.prefixText.fontSize,
          lineHeight: vars.variantOutline.enabled.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantOutline.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.variantOutline.enabled.prefixIcon.size,
          height: vars.variantOutline.enabled.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantOutline.enabled.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.variantOutline.enabled.suffixText.fontSize,
          lineHeight: vars.variantOutline.enabled.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.variantOutline.enabled.suffixIcon.size,
          height: vars.variantOutline.enabled.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },
        },
      },
      underline: {
        root: {
          minHeight: vars.variantUnderline.enabled.root.minHeight,

          boxShadow: `inset 0 calc(${vars.variantUnderline.enabled.root.strokeBottomWidth} * -1) 0 0 ${vars.base.enabled.root.strokeColor}`,

          [pseudo(not(readOnly), focus)]: {
            boxShadow: `inset 0 calc(${vars.variantUnderline.focused.root.strokeBottomWidth} * -1) 0 0 ${vars.base.focused.root.strokeColor}`,
          },

          [pseudo(invalid)]: {
            boxShadow: `inset 0 calc(${vars.variantUnderline.invalid.root.strokeBottomWidth} * -1) 0 0 ${vars.base.invalid.root.strokeColor}`,
          },

          [pseudo(invalid, focus)]: {
            boxShadow: `inset 0 calc(${vars.variantUnderline.invalid.root.strokeBottomWidth} * -1) 0 0 ${vars.base.invalidFocused.root.strokeColor}`,
          },
        },
        value: {
          fontSize: vars.variantUnderline.enabled.value.fontSize,
          lineHeight: vars.variantUnderline.enabled.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantUnderline.enabled.placeholder.fontSize,
            lineHeight: vars.variantUnderline.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantUnderline.enabled.prefixText.fontSize,
          lineHeight: vars.variantUnderline.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantUnderline.enabled.prefixIcon.size,
          height: vars.variantUnderline.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantUnderline.enabled.suffixText.fontSize,
          lineHeight: vars.variantUnderline.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantUnderline.enabled.suffixIcon.size,
          height: vars.variantUnderline.enabled.suffixIcon.size,
        },
      },
    },
  },
});

export default textInput;

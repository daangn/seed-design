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
    size: "large",
  },
  compoundVariants: [
    {
      variant: "outline",
      size: "large",
      css: {
        root: {
          gap: vars.variantOutlineSizeLarge.enabled.root.gap,
          minHeight: vars.variantOutlineSizeLarge.enabled.root.minHeight,
        },
        value: {
          fontSize: vars.variantOutlineSizeLarge.enabled.value.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.enabled.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutlineSizeLarge.enabled.placeholder.fontSize,
            lineHeight: vars.variantOutlineSizeLarge.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantOutlineSizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantOutlineSizeLarge.enabled.prefixIcon.size,
          height: vars.variantOutlineSizeLarge.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantOutlineSizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantOutlineSizeLarge.enabled.suffixIcon.size,
          height: vars.variantOutlineSizeLarge.enabled.suffixIcon.size,
        },
      },
    },
    {
      variant: "outline",
      size: "medium",
      css: {
        root: {
          gap: vars.variantOutlineSizeMedium.enabled.root.gap,
          minHeight: vars.variantOutlineSizeMedium.enabled.root.minHeight,
        },
        value: {
          fontSize: vars.variantOutlineSizeMedium.enabled.value.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.enabled.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutlineSizeMedium.enabled.placeholder.fontSize,
            lineHeight: vars.variantOutlineSizeMedium.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantOutlineSizeMedium.enabled.prefixText.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantOutlineSizeMedium.enabled.prefixIcon.size,
          height: vars.variantOutlineSizeMedium.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantOutlineSizeMedium.enabled.suffixText.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantOutlineSizeMedium.enabled.suffixIcon.size,
          height: vars.variantOutlineSizeMedium.enabled.suffixIcon.size,
        },
      },
    },
  ],
  variants: {
    variant: {
      outline: {
        root: {
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

          // apply disabled style if readonly && disabled both are true
          [pseudo(readOnly, not(disabled))]: {
            backgroundColor: vars.variantOutline.readonly.root.color,
          },
        },
        value: {
          [pseudo(":first-child")]: {
            paddingInlineStart: vars.variantOutline.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },
        },
        prefixText: {
          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantOutline.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantOutline.enabled.root.paddingX,
          },
        },
        suffixText: {
          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantOutline.enabled.root.paddingX,
          },
        },
      },
      underline: {
        root: {
          gap: vars.variantUnderline.enabled.root.gap,
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

          [pseudo(readOnly, not(disabled))]: {
            color: vars.variantUnderline.readonly.value.color,
          },

          [pseudo(readOnly, not(disabled), "::placeholder")]: {
            color: vars.variantUnderline.readonly.placeholder.color,
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
    size: {
      large: {
        value: {
          [pseudo(":is(textarea)")]: {
            minHeight: vars.typeMultilineSizeLarge.enabled.root.minHeight,
            paddingBlock: vars.typeMultilineSizeLarge.enabled.root.paddingY,
          },
        },
      },
      medium: {
        value: {
          [pseudo(":is(textarea)")]: {
            minHeight: vars.typeMultilineSizeMedium.enabled.root.minHeight,
            paddingBlock: vars.typeMultilineSizeMedium.enabled.root.paddingY,
          },
        },
      },
    },
  },
});

export default textInput;

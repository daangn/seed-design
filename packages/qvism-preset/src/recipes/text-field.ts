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
      height: "100%",

      color: vars.base.enabled.value.color,

      [pseudo(":is(input)")]: {
        // browser sets the default width of inputs based on the 'size' prop of the input (e.g. <input size="20" />)
        width: 0,
        // this sets the width to 0 to prevent any overflow and fill the available space of the parent flex container
        // note: this only works with flexGrow: 1

        paddingInline: 0,
      },

      [pseudo(":is(textarea)")]: {
        paddingInline: 0,

        minHeight: "90px",
      },

      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
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
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,
    },
    suffixText: {
      color: vars.base.enabled.suffixText.color,
    },
    suffixIcon: {
      color: vars.base.enabled.suffixIcon.color,
      flexShrink: 0,
    },
  },
  defaultVariants: {
    variant: "rounded",
  },
  variants: {
    variant: {
      rounded: {
        root: {
          minHeight: vars.variantRounded.enabled.root.minHeight,
          borderRadius: vars.variantRounded.enabled.root.cornerRadius,

          boxShadow: `inset 0 0 0 ${vars.variantRounded.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

          [pseudo(not(readOnly), focus)]: {
            boxShadow: `inset 0 0 0 ${vars.variantRounded.focused.root.strokeWidth} ${vars.base.focused.root.strokeColor}`,
          },

          [pseudo(invalid)]: {
            boxShadow: `inset 0 0 0 ${vars.variantRounded.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
          },

          [pseudo(invalid, focus)]: {
            boxShadow: `inset 0 0 0 ${vars.variantRounded.invalid.root.strokeWidth} ${vars.base.invalidFocused.root.strokeColor}`,
          },

          [pseudo(disabled)]: {
            backgroundColor: vars.variantRounded.disabled.root.color,
          },
        },
        value: {
          fontSize: vars.variantRounded.enabled.value.fontSize,
          lineHeight: vars.variantRounded.enabled.value.lineHeight,

          // We intentionally apply root's paddingY to value for input touch area.
          paddingBlock: vars.variantRounded.enabled.root.paddingY,

          [pseudo(":first-child")]: {
            paddingInlineStart: vars.variantRounded.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.variantRounded.enabled.root.paddingX,
          },

          [pseudo("::placeholder")]: {
            fontSize: vars.variantRounded.enabled.placeholder.fontSize,
            lineHeight: vars.variantRounded.enabled.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantRounded.enabled.prefixText.fontSize,
          lineHeight: vars.variantRounded.enabled.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantRounded.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.variantRounded.enabled.prefixIcon.size,
          height: vars.variantRounded.enabled.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.variantRounded.enabled.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.variantRounded.enabled.suffixText.fontSize,
          lineHeight: vars.variantRounded.enabled.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantRounded.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.variantRounded.enabled.suffixIcon.size,
          height: vars.variantRounded.enabled.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.variantRounded.enabled.root.paddingX,
          },
        },
      },
      underline: {
        root: {
          paddingBlock: vars.variantUnderline.enabled.root.paddingY,

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

          // We intentionally apply root's paddingY to value for input touch area.
          paddingBlock: vars.variantUnderline.enabled.root.paddingY,

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

export default textField;

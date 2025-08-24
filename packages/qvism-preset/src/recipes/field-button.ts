import { fieldButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const fieldButton = defineSlotRecipe({
  name: "field-button",
  slots: ["root", "value", "prefixText", "prefixIcon", "suffixText", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      width: "100%",

      alignItems: "center",

      backgroundColor: vars.base.enabled.root.color,
      borderStyle: "solid",
      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,

      overflow: "hidden",

      [pseudo(not(readOnly), focus)]: {
        borderColor: vars.base.focused.root.strokeColor,
      },

      [pseudo(invalid)]: {
        backgroundColor: vars.base.invalid.root.color,
        borderColor: vars.base.invalid.root.strokeColor,
      },

      [pseudo(invalid, focus)]: {
        backgroundColor: vars.base.invalidFocused.root.color,
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(readOnly)]: {
        backgroundColor: vars.base.readonly.root.color,
      },
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

      // [pseudo("::placeholder")]: {
      //   color: vars.base.enabled.placeholder.color,
      // },

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,
      },

      // [pseudo(disabled, "::placeholder")]: {
      //   color: vars.base.disabled.placeholder.color,
      // },
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
  },
  defaultVariants: {
    size: "medium",
  },
  variants: {
    size: {
      xlarge: {
        root: {
          minHeight: vars.sizeXlarge.enabled.root.minHeight,
          borderRadius: vars.sizeXlarge.enabled.root.cornerRadius,
          gap: vars.sizeXlarge.enabled.root.gap,
        },
        value: {
          paddingBlock: vars.sizeXlarge.enabled.root.paddingY,

          [pseudo(":first-child")]: {
            paddingInlineStart: vars.sizeXlarge.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.sizeXlarge.enabled.root.paddingX,
          },

          fontSize: vars.sizeXlarge.enabled.value.fontSize,
          lineHeight: vars.sizeXlarge.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeXlarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeXlarge.enabled.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeXlarge.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.sizeXlarge.enabled.prefixIcon.size,
          height: vars.sizeXlarge.enabled.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeXlarge.enabled.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.sizeXlarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeXlarge.enabled.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeXlarge.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.sizeXlarge.enabled.suffixIcon.size,
          height: vars.sizeXlarge.enabled.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeXlarge.enabled.root.paddingX,
          },
        },
      },
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          gap: vars.sizeLarge.enabled.root.gap,
        },
        value: {
          paddingBlock: vars.sizeLarge.enabled.root.paddingY,

          [pseudo(":first-child")]: {
            paddingInlineStart: vars.sizeLarge.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.sizeLarge.enabled.root.paddingX,
          },

          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeLarge.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeLarge.enabled.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.sizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.sizeLarge.enabled.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeLarge.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.sizeLarge.enabled.suffixIcon.size,
          height: vars.sizeLarge.enabled.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeLarge.enabled.root.paddingX,
          },
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        value: {
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,

          [pseudo(":first-child")]: {
            paddingInlineStart: vars.sizeMedium.enabled.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingInlineEnd: vars.sizeMedium.enabled.root.paddingX,
          },

          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeMedium.enabled.prefixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeMedium.enabled.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.sizeMedium.enabled.prefixIcon.size,
          height: vars.sizeMedium.enabled.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginInlineStart: vars.sizeMedium.enabled.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.sizeMedium.enabled.suffixText.fontSize,
          lineHeight: vars.sizeMedium.enabled.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeMedium.enabled.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.sizeMedium.enabled.suffixIcon.size,
          height: vars.sizeMedium.enabled.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginInlineEnd: vars.sizeMedium.enabled.root.paddingX,
          },
        },
      },
    },
  },
});

export default fieldButton;

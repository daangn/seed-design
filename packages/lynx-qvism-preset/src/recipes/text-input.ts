import { textInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const textInput = defineSlotRecipe({
  name: "text-input",
  slots: [
    "root",
    "stroke",
    "value",
    "textareaRoot",
    "textareaValue",
    "textareaControl",
    "textareaMirror",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    stroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderColor: "transparent",
      transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,
      pointerEvents: "none",
    },
    value: {
      flexGrow: 1,
      minWidth: 0,
      alignSelf: "stretch",
      padding: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
      color: vars.base.enabled.value.color,
      fontWeight: vars.base.enabled.value.fontWeight,
    },
    textareaRoot: {
      flexGrow: 1,
      minWidth: 0,
      position: "relative",
      alignSelf: "stretch",
    },
    textareaValue: {},
    textareaControl: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    textareaMirror: {
      width: "100%",
      visibility: "hidden",
      whiteSpace: "normal",
      wordBreak: "break-all",
      pointerEvents: "none",
    },
    prefixText: {
      color: vars.base.enabled.prefixText.color,
      fontWeight: vars.base.enabled.prefixText.fontWeight,
      flexShrink: 0,
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,
    },
    suffixText: {
      color: vars.base.enabled.suffixText.color,
      fontWeight: vars.base.enabled.suffixText.fontWeight,
      flexShrink: 0,
    },
    suffixIcon: {
      color: vars.base.enabled.suffixIcon.color,
      flexShrink: 0,
    },
  },
  variants: {
    variant: {
      outline: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        stroke: {
          borderStyle: "solid",
          borderWidth: vars.variantOutline.focused.root.strokeWidth,
        },
      },
      underline: {
        root: {
          boxShadow: `inset 0 calc(${vars.variantUnderline.enabled.root.strokeBottomWidth} * -1) 0 0 ${vars.base.enabled.root.strokeColor}`,
        },
        stroke: {
          borderWidth: 0,
          borderBottomStyle: "solid",
          borderBottomWidth: vars.variantUnderline.focused.root.strokeBottomWidth,
        },
      },
    },
    size: {
      large: {
        textareaValue: {
          minHeight: vars.typeMultilineSizeLarge.enabled.root.minHeight,
          paddingTop: vars.typeMultilineSizeLarge.enabled.root.paddingY,
          paddingBottom: vars.typeMultilineSizeLarge.enabled.root.paddingY,
        },
      },
      medium: {
        textareaValue: {
          minHeight: vars.typeMultilineSizeMedium.enabled.root.minHeight,
          paddingTop: vars.typeMultilineSizeMedium.enabled.root.paddingY,
          paddingBottom: vars.typeMultilineSizeMedium.enabled.root.paddingY,
        },
      },
    },
    focused: {
      true: {
        stroke: {
          borderColor: vars.base.focused.root.strokeColor,
        },
      },
      false: {},
    },
    invalid: {
      true: {
        stroke: {
          borderColor: vars.base.invalid.root.strokeColor,
        },
      },
      false: {},
    },
    readOnly: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        value: { color: vars.base.disabled.value.color },
        prefixText: { color: vars.base.disabled.prefixText.color },
        prefixIcon: { color: vars.base.disabled.prefixIcon.color },
        suffixText: { color: vars.base.disabled.suffixText.color },
        suffixIcon: { color: vars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "outline",
      size: "large",
      css: {
        root: {
          gap: vars.variantOutlineSizeLarge.enabled.root.gap,
          minHeight: vars.variantOutlineSizeLarge.enabled.root.minHeight,
          borderRadius: vars.variantOutlineSizeLarge.enabled.root.cornerRadius,
          paddingLeft: vars.variantOutlineSizeLarge.enabled.root.paddingX,
          paddingRight: vars.variantOutlineSizeLarge.enabled.root.paddingX,
        },
        stroke: {
          borderRadius: vars.variantOutlineSizeLarge.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.variantOutlineSizeLarge.enabled.value.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.enabled.value.lineHeight,
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
          borderRadius: vars.variantOutlineSizeMedium.enabled.root.cornerRadius,
          paddingLeft: vars.variantOutlineSizeMedium.enabled.root.paddingX,
          paddingRight: vars.variantOutlineSizeMedium.enabled.root.paddingX,
        },
        stroke: {
          borderRadius: vars.variantOutlineSizeMedium.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.variantOutlineSizeMedium.enabled.value.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.enabled.value.lineHeight,
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
    {
      variant: "underline",
      size: "large",
      css: {
        root: {
          gap: vars.variantUnderlineSizeLarge.enabled.root.gap,
          minHeight: vars.variantUnderlineSizeLarge.enabled.root.minHeight,
          paddingTop: vars.variantUnderlineSizeLarge.enabled.root.paddingY,
          paddingBottom: vars.variantUnderlineSizeLarge.enabled.root.paddingY,
        },
        value: {
          fontSize: vars.variantUnderlineSizeLarge.enabled.value.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.variantUnderlineSizeLarge.enabled.prefixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantUnderlineSizeLarge.enabled.prefixIcon.size,
          height: vars.variantUnderlineSizeLarge.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantUnderlineSizeLarge.enabled.suffixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantUnderlineSizeLarge.enabled.suffixIcon.size,
          height: vars.variantUnderlineSizeLarge.enabled.suffixIcon.size,
        },
      },
    },
    {
      variant: "underline",
      size: "medium",
      css: {
        root: {
          gap: vars.variantUnderlineSizeMedium.enabled.root.gap,
          minHeight: vars.variantUnderlineSizeMedium.enabled.root.minHeight,
          paddingTop: vars.variantUnderlineSizeMedium.enabled.root.paddingY,
          paddingBottom: vars.variantUnderlineSizeMedium.enabled.root.paddingY,
        },
        value: {
          fontSize: vars.variantUnderlineSizeMedium.enabled.value.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.enabled.value.lineHeight,
        },
        prefixText: {
          fontSize: vars.variantUnderlineSizeMedium.enabled.prefixText.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.enabled.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantUnderlineSizeMedium.enabled.prefixIcon.size,
          height: vars.variantUnderlineSizeMedium.enabled.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantUnderlineSizeMedium.enabled.suffixText.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.enabled.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantUnderlineSizeMedium.enabled.suffixIcon.size,
          height: vars.variantUnderlineSizeMedium.enabled.suffixIcon.size,
        },
      },
    },
    {
      variant: "outline",
      readOnly: true,
      disabled: false,
      css: {
        root: { background: vars.variantOutline.readonly.root.color },
      },
    },
    {
      variant: "underline",
      readOnly: true,
      disabled: false,
      css: {
        value: { color: vars.variantUnderline.readonly.value.color },
      },
    },
    {
      variant: "outline",
      disabled: true,
      css: {
        root: { background: vars.variantOutline.disabled.root.color },
      },
    },
  ],
  defaultVariants: {
    variant: "outline",
    size: "large",
    focused: false,
    invalid: false,
    readOnly: false,
    disabled: false,
  },
});

export default textInput;

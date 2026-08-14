import spec from "@seed-design/rootage-artifacts/components/text-input";
import { textInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";
import { breakpoints } from "../utils/breakpoint";

const MAX_DURATION_SECONDS = 2147483647;

const textInput = defineSlotRecipe({
  name: "text-input",
  slots: ["root", "value", "prefixText", "prefixIcon", "suffixText", "suffixIcon"],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderColor: "transparent",

        transition: `border-color ${vars.base.rest.root.strokeDuration} ${vars.base.rest.root.strokeTimingFunction}`,

        pointerEvents: "none",
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
      alignSelf: "stretch",

      color: vars.base.rest.value.color,

      fontWeight: vars.base.rest.value.fontWeight,

      paddingInline: 0,

      [pseudo(":is(input)")]: {
        // browser sets the default width of inputs based on the 'size' prop of the input (e.g. <input size="20" />)
        // this sets the width to 0 to prevent any overflow and fill the available space of the parent flex container
        // note: this only works with flexGrow: 1
        width: 0,
      },

      [pseudo("::placeholder")]: {
        color: vars.base.rest.placeholder.color,
        fontWeight: vars.base.rest.placeholder.fontWeight,
      },

      // disable browser default background colors
      // we can't just set backgroundColor: "transparent" because user agent stylesheets include !important flag
      // might want to set a huge boxShadow to cover the background color, but that causes the root boxShadow to be hidden
      [pseudo(":is(:-webkit-autofill, :autofill)")]: {
        // disable browser default text color
        WebkitTextFillColor: vars.base.rest.value.color,

        // delay transition
        transition: `background-color ${MAX_DURATION_SECONDS}s ${MAX_DURATION_SECONDS}s`,

        // Chrome 120~
        "@supports (background-clip: text)": {
          backgroundClip: "text",
          transition: "none",
        },
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,

        cursor: "not-allowed",
      },

      [pseudo(disabled, "::placeholder")]: {
        color: vars.base.disabled.placeholder.color,
      },
    },
    prefixText: {
      color: vars.base.rest.prefixText.color,
      fontWeight: vars.base.rest.prefixText.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      color: vars.base.rest.prefixIcon.color,
      flexShrink: 0,

      [pseudo(disabled)]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixText: {
      color: vars.base.rest.suffixText.color,
      fontWeight: vars.base.rest.suffixText.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixText.color,
      },
    },
    suffixIcon: {
      color: vars.base.rest.suffixIcon.color,
      flexShrink: 0,

      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixIcon.color,
      },
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
          gap: vars.variantOutlineSizeLarge.rest.root.gap,
          minHeight: vars.variantOutlineSizeLargeTypeSingleline.rest.root.minHeight,
          borderRadius: vars.variantOutlineSizeLarge.rest.root.cornerRadius,
        },
        value: {
          fontSize: vars.variantOutlineSizeLarge.rest.value.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutlineSizeLarge.rest.placeholder.fontSize,
            lineHeight: vars.variantOutlineSizeLarge.rest.placeholder.lineHeight,
          },

          [pseudo(":first-child")]: {
            paddingLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingRight: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },
        },
        prefixText: {
          fontSize: vars.variantOutlineSizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.variantOutlineSizeLarge.rest.prefixIcon.size,
          height: vars.variantOutlineSizeLarge.rest.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.variantOutlineSizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.variantOutlineSizeLarge.rest.suffixIcon.size,
          height: vars.variantOutlineSizeLarge.rest.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeLarge.rest.root.paddingX,
          },
        },
      },
    },
    {
      variant: "outline",
      size: "medium",
      css: {
        root: {
          gap: vars.variantOutlineSizeMedium.rest.root.gap,
          minHeight: vars.variantOutlineSizeMediumTypeSingleline.rest.root.minHeight,
          borderRadius: vars.variantOutlineSizeMedium.rest.root.cornerRadius,
        },
        value: {
          fontSize: vars.variantOutlineSizeMedium.rest.value.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.rest.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutlineSizeMedium.rest.placeholder.fontSize,
            lineHeight: vars.variantOutlineSizeMedium.rest.placeholder.lineHeight,
          },

          [pseudo(":first-child")]: {
            paddingLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },

          [pseudo(":last-child")]: {
            paddingRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },
        },
        prefixText: {
          fontSize: vars.variantOutlineSizeMedium.rest.prefixText.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.rest.prefixText.lineHeight,

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },
        },
        prefixIcon: {
          width: vars.variantOutlineSizeMedium.rest.prefixIcon.size,
          height: vars.variantOutlineSizeMedium.rest.prefixIcon.size,

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },
        },
        suffixText: {
          fontSize: vars.variantOutlineSizeMedium.rest.suffixText.fontSize,
          lineHeight: vars.variantOutlineSizeMedium.rest.suffixText.lineHeight,

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },
        },
        suffixIcon: {
          width: vars.variantOutlineSizeMedium.rest.suffixIcon.size,
          height: vars.variantOutlineSizeMedium.rest.suffixIcon.size,

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
          },
        },
      },
    },
    {
      variant: "outline",
      size: "responsive",
      css: {
        root: {
          gap: vars.variantOutlineSizeLarge.rest.root.gap,
          minHeight: vars.variantOutlineSizeLargeTypeSingleline.rest.root.minHeight,
          borderRadius: vars.variantOutlineSizeLarge.rest.root.cornerRadius,

          [breakpoints.up("lg")]: {
            gap: vars.variantOutlineSizeMedium.rest.root.gap,
            minHeight: vars.variantOutlineSizeMediumTypeSingleline.rest.root.minHeight,
            borderRadius: vars.variantOutlineSizeMedium.rest.root.cornerRadius,
          },
        },
        value: {
          fontSize: vars.variantOutlineSizeLarge.rest.value.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantOutlineSizeMedium.rest.value.fontSize,
            lineHeight: vars.variantOutlineSizeMedium.rest.value.lineHeight,
          },

          [pseudo("::placeholder")]: {
            fontSize: vars.variantOutlineSizeLarge.rest.placeholder.fontSize,
            lineHeight: vars.variantOutlineSizeLarge.rest.placeholder.lineHeight,

            [breakpoints.up("lg")]: {
              fontSize: vars.variantOutlineSizeMedium.rest.placeholder.fontSize,
              lineHeight: vars.variantOutlineSizeMedium.rest.placeholder.lineHeight,
            },
          },

          [pseudo(":first-child")]: {
            paddingLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              paddingLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },

          [pseudo(":last-child")]: {
            paddingRight: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              paddingRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },
        },
        prefixText: {
          fontSize: vars.variantOutlineSizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.prefixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantOutlineSizeMedium.rest.prefixText.fontSize,
            lineHeight: vars.variantOutlineSizeMedium.rest.prefixText.lineHeight,
          },

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              marginLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },
        },
        prefixIcon: {
          width: vars.variantOutlineSizeLarge.rest.prefixIcon.size,
          height: vars.variantOutlineSizeLarge.rest.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.variantOutlineSizeMedium.rest.prefixIcon.size,
            height: vars.variantOutlineSizeMedium.rest.prefixIcon.size,
          },

          [pseudo(":first-child")]: {
            marginLeft: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              marginLeft: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },
        },
        suffixText: {
          fontSize: vars.variantOutlineSizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.variantOutlineSizeLarge.rest.suffixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantOutlineSizeMedium.rest.suffixText.fontSize,
            lineHeight: vars.variantOutlineSizeMedium.rest.suffixText.lineHeight,
          },

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              marginRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },
        },
        suffixIcon: {
          width: vars.variantOutlineSizeLarge.rest.suffixIcon.size,
          height: vars.variantOutlineSizeLarge.rest.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.variantOutlineSizeMedium.rest.suffixIcon.size,
            height: vars.variantOutlineSizeMedium.rest.suffixIcon.size,
          },

          [pseudo(":last-child")]: {
            marginRight: vars.variantOutlineSizeLarge.rest.root.paddingX,

            [breakpoints.up("lg")]: {
              marginRight: vars.variantOutlineSizeMedium.rest.root.paddingX,
            },
          },
        },
      },
    },
    {
      variant: "underline",
      size: "large",
      css: {
        root: {
          gap: vars.variantUnderlineSizeLarge.rest.root.gap,
          minHeight: vars.variantUnderlineSizeLargeTypeSingleline.rest.root.minHeight,
          paddingBlock: vars.variantUnderlineSizeLargeTypeSingleline.rest.root.paddingY,
        },
        value: {
          fontSize: vars.variantUnderlineSizeLarge.rest.value.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantUnderlineSizeLarge.rest.placeholder.fontSize,
            lineHeight: vars.variantUnderlineSizeLarge.rest.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantUnderlineSizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantUnderlineSizeLarge.rest.prefixIcon.size,
          height: vars.variantUnderlineSizeLarge.rest.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantUnderlineSizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantUnderlineSizeLarge.rest.suffixIcon.size,
          height: vars.variantUnderlineSizeLarge.rest.suffixIcon.size,
        },
      },
    },
    {
      variant: "underline",
      size: "medium",
      css: {
        root: {
          gap: vars.variantUnderlineSizeMedium.rest.root.gap,
          minHeight: vars.variantUnderlineSizeMediumTypeSingleline.rest.root.minHeight,
          paddingBlock: vars.variantUnderlineSizeMediumTypeSingleline.rest.root.paddingY,
        },
        value: {
          fontSize: vars.variantUnderlineSizeMedium.rest.value.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.rest.value.lineHeight,

          [pseudo("::placeholder")]: {
            fontSize: vars.variantUnderlineSizeMedium.rest.placeholder.fontSize,
            lineHeight: vars.variantUnderlineSizeMedium.rest.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.variantUnderlineSizeMedium.rest.prefixText.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.rest.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.variantUnderlineSizeMedium.rest.prefixIcon.size,
          height: vars.variantUnderlineSizeMedium.rest.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.variantUnderlineSizeMedium.rest.suffixText.fontSize,
          lineHeight: vars.variantUnderlineSizeMedium.rest.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.variantUnderlineSizeMedium.rest.suffixIcon.size,
          height: vars.variantUnderlineSizeMedium.rest.suffixIcon.size,
        },
      },
    },
    {
      variant: "underline",
      size: "responsive",
      css: {
        root: {
          gap: vars.variantUnderlineSizeLarge.rest.root.gap,
          minHeight: vars.variantUnderlineSizeLargeTypeSingleline.rest.root.minHeight,
          paddingBlock: vars.variantUnderlineSizeLargeTypeSingleline.rest.root.paddingY,

          [breakpoints.up("lg")]: {
            gap: vars.variantUnderlineSizeMedium.rest.root.gap,
            minHeight: vars.variantUnderlineSizeMediumTypeSingleline.rest.root.minHeight,
            paddingBlock: vars.variantUnderlineSizeMediumTypeSingleline.rest.root.paddingY,
          },
        },
        value: {
          fontSize: vars.variantUnderlineSizeLarge.rest.value.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantUnderlineSizeMedium.rest.value.fontSize,
            lineHeight: vars.variantUnderlineSizeMedium.rest.value.lineHeight,
          },

          [pseudo("::placeholder")]: {
            fontSize: vars.variantUnderlineSizeLarge.rest.placeholder.fontSize,
            lineHeight: vars.variantUnderlineSizeLarge.rest.placeholder.lineHeight,

            [breakpoints.up("lg")]: {
              fontSize: vars.variantUnderlineSizeMedium.rest.placeholder.fontSize,
              lineHeight: vars.variantUnderlineSizeMedium.rest.placeholder.lineHeight,
            },
          },
        },
        prefixText: {
          fontSize: vars.variantUnderlineSizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.prefixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantUnderlineSizeMedium.rest.prefixText.fontSize,
            lineHeight: vars.variantUnderlineSizeMedium.rest.prefixText.lineHeight,
          },
        },
        prefixIcon: {
          width: vars.variantUnderlineSizeLarge.rest.prefixIcon.size,
          height: vars.variantUnderlineSizeLarge.rest.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.variantUnderlineSizeMedium.rest.prefixIcon.size,
            height: vars.variantUnderlineSizeMedium.rest.prefixIcon.size,
          },
        },
        suffixText: {
          fontSize: vars.variantUnderlineSizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.variantUnderlineSizeLarge.rest.suffixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.variantUnderlineSizeMedium.rest.suffixText.fontSize,
            lineHeight: vars.variantUnderlineSizeMedium.rest.suffixText.lineHeight,
          },
        },
        suffixIcon: {
          width: vars.variantUnderlineSizeLarge.rest.suffixIcon.size,
          height: vars.variantUnderlineSizeLarge.rest.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.variantUnderlineSizeMedium.rest.suffixIcon.size,
            height: vars.variantUnderlineSizeMedium.rest.suffixIcon.size,
          },
        },
      },
    },
  ],
  variants: {
    variant: {
      outline: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutline.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

          "&::after": {
            borderStyle: "solid",
            borderWidth: vars.variantOutline.focused.root.strokeWidth,
          },

          [pseudo(not(readOnly), focus, "::after")]: {
            borderColor: vars.base.focused.root.strokeColor,
            borderWidth: vars.variantOutline.focused.root.strokeWidth,
          },

          [pseudo(invalid, "::after")]: {
            borderColor: vars.base.invalid.root.strokeColor,
            borderWidth: vars.variantOutline.invalid.root.strokeWidth,
          },

          [pseudo(invalid, focus, "::after")]: {
            borderColor: vars.base.focusedInvalid.root.strokeColor,
            borderWidth: vars.variantOutline.invalid.root.strokeWidth,
          },

          [pseudo(disabled)]: {
            backgroundColor: vars.variantOutline.disabled.root.color,
          },

          // apply disabled style if readonly && disabled both are true
          [pseudo(readOnly, not(disabled))]: {
            backgroundColor: vars.variantOutline.readonly.root.color,
          },
        },
      },
      underline: {
        root: {
          boxShadow: `inset 0 calc(${vars.variantUnderline.rest.root.strokeBottomWidth} * -1) 0 0 ${vars.base.rest.root.strokeColor}`,

          "&::after": {
            borderBottomStyle: "solid",
            borderBottomWidth: vars.variantUnderline.focused.root.strokeBottomWidth,
          },

          [pseudo(not(readOnly), focus, "::after")]: {
            borderBottomColor: vars.base.focused.root.strokeColor,
            borderBottomWidth: vars.variantUnderline.focused.root.strokeBottomWidth,
          },

          [pseudo(invalid, "::after")]: {
            borderBottomColor: vars.base.invalid.root.strokeColor,
            borderBottomWidth: vars.variantUnderline.invalid.root.strokeBottomWidth,
          },

          [pseudo(invalid, focus, "::after")]: {
            borderBottomColor: vars.base.focusedInvalid.root.strokeColor,
            borderBottomWidth: vars.variantUnderline.invalid.root.strokeBottomWidth,
          },
        },
        value: {
          [pseudo(readOnly, not(disabled))]: {
            color: vars.variantUnderline.readonly.value.color,
          },

          [pseudo(readOnly, not(disabled), "::placeholder")]: {
            color: vars.variantUnderline.readonly.placeholder.color,
          },
        },
      },
    },
    size: {
      large: {
        value: {
          [pseudo(":is(textarea)")]: {
            minHeight: vars.sizeLargeTypeMultiline.rest.root.minHeight,
            paddingBlock: vars.sizeLargeTypeMultiline.rest.root.paddingY,
          },
        },
      },
      medium: {
        value: {
          [pseudo(":is(textarea)")]: {
            minHeight: vars.sizeMediumTypeMultiline.rest.root.minHeight,
            paddingBlock: vars.sizeMediumTypeMultiline.rest.root.paddingY,
          },
        },
      },
      responsive: {
        value: {
          [pseudo(":is(textarea)")]: {
            minHeight: vars.sizeLargeTypeMultiline.rest.root.minHeight,
            paddingBlock: vars.sizeLargeTypeMultiline.rest.root.paddingY,

            [breakpoints.up("lg")]: {
              minHeight: vars.sizeMediumTypeMultiline.rest.root.minHeight,
              paddingBlock: vars.sizeMediumTypeMultiline.rest.root.paddingY,
            },
          },
        },
      },
    },
  },
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
      size: {
        ...spec.data.schema.variants.size,
        values: {
          ...spec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.",
          },
        },
      },
    },
  },
});

export default textInput;

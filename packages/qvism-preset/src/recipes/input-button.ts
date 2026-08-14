import spec from "@seed-design/rootage-artifacts/components/input-button";
import { inputButton as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, engaged, focusVisible, invalid, not, readOnly } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { vars as tokens } from "../vars";
import { breakpoints } from "../utils/breakpoint";

const inputButton = defineSlotRecipe({
  name: "input-button",
  slots: [
    "root",
    "value",
    "placeholder",
    "button",
    "prefixText",
    "prefixIcon",
    "suffixText",
    "suffixIcon",
    "clearButton",
  ],
  base: {
    root: {
      display: "flex",
      width: "100%",
      alignItems: "center",

      boxSizing: "border-box",

      position: "relative",
      isolation: "isolate",
    },
    button: {
      position: "absolute",
      zIndex: -1,

      inset: 0,

      cursor: "pointer",

      border: "none",
      padding: 0,

      backgroundColor: vars.base.rest.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: vars.base.invalid.root.strokeWidth,

        transition: `border-color ${vars.base.rest.root.strokeDuration} ${vars.base.rest.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo("[data-disabled]")]: {
        cursor: "not-allowed",
        backgroundColor: vars.base.disabled.root.color,
      },

      [pseudo(not("[data-disabled]"), not(readOnly), engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        cursor: "default",
        backgroundColor: vars.base.readonly.root.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(invalid, "::after")]: {
        borderWidth: vars.base.invalid.root.strokeWidth,
        borderColor: vars.base.invalid.root.strokeColor,
      },
    },
    value: {
      fontWeight: vars.base.rest.value.fontWeight,

      color: vars.base.rest.value.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.value.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.value.color,
      },
    },
    placeholder: {
      fontWeight: vars.base.rest.placeholder.fontWeight,

      color: vars.base.rest.placeholder.color,

      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      flexGrow: 1,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.placeholder.color,
      },

      [pseudo(readOnly, not("[data-disabled]"))]: {
        color: vars.base.readonly.placeholder.color,
      },
    },
    prefixText: {
      fontWeight: vars.base.rest.prefixText.fontWeight,

      color: vars.base.rest.prefixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: vars.base.rest.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixText: {
      fontWeight: vars.base.rest.suffixText.fontWeight,

      color: vars.base.rest.suffixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.suffixText.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: vars.base.rest.suffixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.suffixIcon.color,
      },
    },
    clearButton: {
      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",

      padding: 0,

      borderRadius: tokens.$radius.full,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      ...onlyIcon({
        color: vars.base.rest.clearButton.color,
      }),
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: vars.sizeLarge.rest.root.height,
          gap: vars.sizeLarge.rest.root.gap,
          paddingInline: vars.sizeLarge.rest.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeLarge.rest.value.fontSize,
          lineHeight: vars.sizeLarge.rest.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeLarge.rest.placeholder.fontSize,
          lineHeight: vars.sizeLarge.rest.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.sizeLarge.rest.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLarge.rest.prefixIcon.size,
          height: vars.sizeLarge.rest.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.sizeLarge.rest.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeLarge.rest.suffixIcon.size,
          height: vars.sizeLarge.rest.suffixIcon.size,
        },
        clearButton: onlyIcon({
          size: vars.sizeLarge.rest.clearButton.size,
        }),
      },
      medium: {
        root: {
          height: vars.sizeMedium.rest.root.height,
          gap: vars.sizeMedium.rest.root.gap,
          paddingInline: vars.sizeMedium.rest.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeMedium.rest.value.fontSize,
          lineHeight: vars.sizeMedium.rest.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeMedium.rest.placeholder.fontSize,
          lineHeight: vars.sizeMedium.rest.placeholder.lineHeight,
        },
        prefixText: {
          fontSize: vars.sizeMedium.rest.prefixText.fontSize,
          lineHeight: vars.sizeMedium.rest.prefixText.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMedium.rest.prefixIcon.size,
          height: vars.sizeMedium.rest.prefixIcon.size,
        },
        suffixText: {
          fontSize: vars.sizeMedium.rest.suffixText.fontSize,
          lineHeight: vars.sizeMedium.rest.suffixText.lineHeight,
        },
        suffixIcon: {
          width: vars.sizeMedium.rest.suffixIcon.size,
          height: vars.sizeMedium.rest.suffixIcon.size,
        },
        clearButton: onlyIcon({
          size: vars.sizeMedium.rest.clearButton.size,
        }),
      },
      responsive: {
        root: {
          height: vars.sizeLarge.rest.root.height,
          gap: vars.sizeLarge.rest.root.gap,
          paddingInline: vars.sizeLarge.rest.root.paddingX,

          [breakpoints.up("lg")]: {
            height: vars.sizeMedium.rest.root.height,
            gap: vars.sizeMedium.rest.root.gap,
            paddingInline: vars.sizeMedium.rest.root.paddingX,
          },
        },
        button: {
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,

          [breakpoints.up("lg")]: {
            borderRadius: vars.sizeMedium.rest.root.cornerRadius,
          },
        },
        value: {
          fontSize: vars.sizeLarge.rest.value.fontSize,
          lineHeight: vars.sizeLarge.rest.value.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.rest.value.fontSize,
            lineHeight: vars.sizeMedium.rest.value.lineHeight,
          },
        },
        placeholder: {
          fontSize: vars.sizeLarge.rest.placeholder.fontSize,
          lineHeight: vars.sizeLarge.rest.placeholder.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.rest.placeholder.fontSize,
            lineHeight: vars.sizeMedium.rest.placeholder.lineHeight,
          },
        },
        prefixText: {
          fontSize: vars.sizeLarge.rest.prefixText.fontSize,
          lineHeight: vars.sizeLarge.rest.prefixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.rest.prefixText.fontSize,
            lineHeight: vars.sizeMedium.rest.prefixText.lineHeight,
          },
        },
        prefixIcon: {
          width: vars.sizeLarge.rest.prefixIcon.size,
          height: vars.sizeLarge.rest.prefixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.sizeMedium.rest.prefixIcon.size,
            height: vars.sizeMedium.rest.prefixIcon.size,
          },
        },
        suffixText: {
          fontSize: vars.sizeLarge.rest.suffixText.fontSize,
          lineHeight: vars.sizeLarge.rest.suffixText.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: vars.sizeMedium.rest.suffixText.fontSize,
            lineHeight: vars.sizeMedium.rest.suffixText.lineHeight,
          },
        },
        suffixIcon: {
          width: vars.sizeLarge.rest.suffixIcon.size,
          height: vars.sizeLarge.rest.suffixIcon.size,

          [breakpoints.up("lg")]: {
            width: vars.sizeMedium.rest.suffixIcon.size,
            height: vars.sizeMedium.rest.suffixIcon.size,
          },
        },
        clearButton: {
          ...onlyIcon({
            size: vars.sizeLarge.rest.clearButton.size,
          }),

          [breakpoints.up("lg")]: onlyIcon({
            size: vars.sizeMedium.rest.clearButton.size,
          }),
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: {
      ...spec.data.schema.variants,
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

export default inputButton;

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

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      cursor: "pointer",

      border: "none",
      padding: 0,

      backgroundColor: vars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: vars.base.invalid.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

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
      fontWeight: vars.base.enabled.value.fontWeight,

      color: vars.base.enabled.value.color,

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
      fontWeight: vars.base.enabled.placeholder.fontWeight,

      color: vars.base.enabled.placeholder.color,

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
      fontWeight: vars.base.enabled.prefixText.fontWeight,

      color: vars.base.enabled.prefixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixText.color,
      },
    },
    prefixIcon: {
      flexShrink: 0,

      color: vars.base.enabled.prefixIcon.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.prefixIcon.color,
      },
    },
    suffixText: {
      fontWeight: vars.base.enabled.suffixText.fontWeight,

      color: vars.base.enabled.suffixText.color,

      pointerEvents: "none",

      [pseudo("[data-disabled]")]: {
        color: vars.base.disabled.suffixText.color,
      },
    },
    suffixIcon: {
      flexShrink: 0,

      color: vars.base.enabled.suffixIcon.color,

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
        color: vars.base.enabled.clearButton.color,
      }),
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          gap: vars.sizeLarge.enabled.root.gap,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: vars.sizeLarge.enabled.placeholder.lineHeight,
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
        clearButton: onlyIcon({
          size: vars.sizeLarge.enabled.clearButton.size,
        }),
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          gap: vars.sizeMedium.enabled.root.gap,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
        },
        button: {
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
        value: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: vars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: vars.sizeMedium.enabled.placeholder.lineHeight,
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
        clearButton: onlyIcon({
          size: vars.sizeMedium.enabled.clearButton.size,
        }),
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});

export default inputButton;

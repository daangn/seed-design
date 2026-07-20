import spec from "@seed-design/rootage-artifacts/components/quantity-picker.json" with {
  type: "json",
};
import { quantityPicker as vars } from "../vars/component";
import { quantityPickerButton as buttonVars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { disabled, engaged, focusVisible, invalid, loading, not, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const quantityPicker = defineSlotRecipe({
  name: "quantity-picker",
  slots: [
    "root",
    "decrementButton",
    "decrementIcon",
    "valueDisplay",
    "valueDisplayPlaceholder",
    "valueDisplayText",
    "divider",
    "incrementButton",
    "incrementIcon",
  ],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",

      backgroundColor: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      [pseudo(invalid)]: {
        boxShadow: `inset 0 0 0 ${vars.base.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
      },
    },
    decrementButton: {
      display: "inline-flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",

      cursor: "pointer",
      border: "none",
      padding: 0,
      backgroundColor: buttonVars.base.enabled.root.color,
      transition: `background-color ${buttonVars.base.enabled.root.colorDuration} ${buttonVars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: buttonVars.base.pressed.root.color,
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
      [pseudo(loading)]: {
        backgroundColor: buttonVars.base.loading.root.color,
      },
    },
    decrementIcon: {
      flexShrink: 0,
      color: buttonVars.base.enabled.icon.color,
      "--track-color": buttonVars.base.enabled.progressCircle.trackColor,
      "--range-color": buttonVars.base.enabled.progressCircle.rangeColor,

      [pseudo(disabled)]: {
        color: buttonVars.base.disabled.icon.color,
      },
    },
    valueDisplay: {
      display: "grid",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",

      fontWeight: vars.base.enabled.valueDisplay.fontWeight,
      color: vars.base.enabled.valueDisplay.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.valueDisplay.color,
      },
    },
    valueDisplayPlaceholder: {
      gridColumn: "1",
      gridRow: "1",
      visibility: "hidden",
      fontVariantNumeric: "tabular-nums",
    },
    valueDisplayText: {
      gridColumn: "1",
      gridRow: "1",
      textAlign: "center",
      fontVariantNumeric: "tabular-nums",
    },
    divider: {
      flexShrink: 0,
      backgroundColor: vars.base.enabled.divider.color,
    },
    incrementButton: {
      display: "inline-flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",

      cursor: "pointer",
      border: "none",
      padding: 0,
      backgroundColor: buttonVars.base.enabled.root.color,
      transition: `background-color ${buttonVars.base.enabled.root.colorDuration} ${buttonVars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: buttonVars.base.pressed.root.color,
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
      [pseudo(loading)]: {
        backgroundColor: buttonVars.base.loading.root.color,
      },
    },
    incrementIcon: {
      flexShrink: 0,
      color: buttonVars.base.enabled.icon.color,
      "--track-color": buttonVars.base.enabled.progressCircle.trackColor,
      "--range-color": buttonVars.base.enabled.progressCircle.rangeColor,

      [pseudo(disabled)]: {
        color: buttonVars.base.disabled.icon.color,
      },
    },
  },
  variants: {
    size: {
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.height,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeSmall.enabled.root.size,
          height: buttonVars.sizeSmall.enabled.root.size,
          borderRadius: buttonVars.sizeSmall.enabled.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeSmall.enabled.icon.size,
          height: buttonVars.sizeSmall.enabled.icon.size,
          "--size": buttonVars.sizeSmall.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeSmall.enabled.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeSmall.enabled.valueDisplay.paddingX,
          fontSize: vars.sizeSmall.enabled.valueDisplay.fontSize,
          lineHeight: vars.sizeSmall.enabled.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeSmall.enabled.divider.width,
          height: vars.sizeSmall.enabled.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeSmall.enabled.root.size,
          height: buttonVars.sizeSmall.enabled.root.size,
          borderRadius: buttonVars.sizeSmall.enabled.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeSmall.enabled.icon.size,
          height: buttonVars.sizeSmall.enabled.icon.size,
          "--size": buttonVars.sizeSmall.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeSmall.enabled.progressCircle.thickness,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeMedium.enabled.root.size,
          height: buttonVars.sizeMedium.enabled.root.size,
          borderRadius: buttonVars.sizeMedium.enabled.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeMedium.enabled.icon.size,
          height: buttonVars.sizeMedium.enabled.icon.size,
          "--size": buttonVars.sizeMedium.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeMedium.enabled.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeMedium.enabled.valueDisplay.paddingX,
          fontSize: vars.sizeMedium.enabled.valueDisplay.fontSize,
          lineHeight: vars.sizeMedium.enabled.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeMedium.enabled.divider.width,
          height: vars.sizeMedium.enabled.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeMedium.enabled.root.size,
          height: buttonVars.sizeMedium.enabled.root.size,
          borderRadius: buttonVars.sizeMedium.enabled.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeMedium.enabled.icon.size,
          height: buttonVars.sizeMedium.enabled.icon.size,
          "--size": buttonVars.sizeMedium.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeMedium.enabled.progressCircle.thickness,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeLarge.enabled.root.size,
          height: buttonVars.sizeLarge.enabled.root.size,
          borderRadius: buttonVars.sizeLarge.enabled.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeLarge.enabled.icon.size,
          height: buttonVars.sizeLarge.enabled.icon.size,
          "--size": buttonVars.sizeLarge.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeLarge.enabled.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeLarge.enabled.valueDisplay.paddingX,
          fontSize: vars.sizeLarge.enabled.valueDisplay.fontSize,
          lineHeight: vars.sizeLarge.enabled.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeLarge.enabled.divider.width,
          height: vars.sizeLarge.enabled.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeLarge.enabled.root.size,
          height: buttonVars.sizeLarge.enabled.root.size,
          borderRadius: buttonVars.sizeLarge.enabled.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeLarge.enabled.icon.size,
          height: buttonVars.sizeLarge.enabled.icon.size,
          "--size": buttonVars.sizeLarge.enabled.progressCircle.size,
          "--thickness": buttonVars.sizeLarge.enabled.progressCircle.thickness,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default quantityPicker;

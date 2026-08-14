import spec from "@seed-design/rootage-artifacts/components/quantity-picker";
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
      width: "fit-content",
      alignItems: "center",
      boxSizing: "border-box",

      backgroundColor: vars.base.rest.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

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
      backgroundColor: buttonVars.base.rest.root.color,
      transition: `background-color ${buttonVars.base.rest.root.colorDuration} ${buttonVars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

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
      color: buttonVars.base.rest.icon.color,
      "--track-color": buttonVars.base.rest.progressCircle.trackColor,
      "--range-color": buttonVars.base.rest.progressCircle.rangeColor,

      [pseudo(disabled)]: {
        color: buttonVars.base.disabled.icon.color,
      },
    },
    valueDisplay: {
      display: "grid",
      flexGrow: 1,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",

      fontWeight: vars.base.rest.valueDisplay.fontWeight,
      color: vars.base.rest.valueDisplay.color,

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
      backgroundColor: vars.base.rest.divider.color,
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
      backgroundColor: buttonVars.base.rest.root.color,
      transition: `background-color ${buttonVars.base.rest.root.colorDuration} ${buttonVars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

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
      color: buttonVars.base.rest.icon.color,
      "--track-color": buttonVars.base.rest.progressCircle.trackColor,
      "--range-color": buttonVars.base.rest.progressCircle.rangeColor,

      [pseudo(disabled)]: {
        color: buttonVars.base.disabled.icon.color,
      },
    },
  },
  variants: {
    // TODO: `disabled` is written before `loading` at equal specificity, so a
    // button that is both keeps the loading background. The spec ranks `disabled`
    // higher; swapping the blocks would match it, but it changes rendered output
    // and wants a design review first.
    layout: {
      hug: {},
      fill: {
        root: {
          flexGrow: 1,
        },
      },
    },
    size: {
      small: {
        root: {
          height: vars.sizeSmall.rest.root.height,
          borderRadius: vars.sizeSmall.rest.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeSmall.rest.root.size,
          height: buttonVars.sizeSmall.rest.root.size,
          borderRadius: buttonVars.sizeSmall.rest.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeSmall.rest.icon.size,
          height: buttonVars.sizeSmall.rest.icon.size,
          "--size": buttonVars.sizeSmall.rest.progressCircle.size,
          "--thickness": buttonVars.sizeSmall.rest.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeSmall.rest.valueDisplay.paddingX,
          fontSize: vars.sizeSmall.rest.valueDisplay.fontSize,
          lineHeight: vars.sizeSmall.rest.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeSmall.rest.divider.width,
          height: vars.sizeSmall.rest.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeSmall.rest.root.size,
          height: buttonVars.sizeSmall.rest.root.size,
          borderRadius: buttonVars.sizeSmall.rest.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeSmall.rest.icon.size,
          height: buttonVars.sizeSmall.rest.icon.size,
          "--size": buttonVars.sizeSmall.rest.progressCircle.size,
          "--thickness": buttonVars.sizeSmall.rest.progressCircle.thickness,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.rest.root.height,
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeMedium.rest.root.size,
          height: buttonVars.sizeMedium.rest.root.size,
          borderRadius: buttonVars.sizeMedium.rest.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeMedium.rest.icon.size,
          height: buttonVars.sizeMedium.rest.icon.size,
          "--size": buttonVars.sizeMedium.rest.progressCircle.size,
          "--thickness": buttonVars.sizeMedium.rest.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeMedium.rest.valueDisplay.paddingX,
          fontSize: vars.sizeMedium.rest.valueDisplay.fontSize,
          lineHeight: vars.sizeMedium.rest.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeMedium.rest.divider.width,
          height: vars.sizeMedium.rest.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeMedium.rest.root.size,
          height: buttonVars.sizeMedium.rest.root.size,
          borderRadius: buttonVars.sizeMedium.rest.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeMedium.rest.icon.size,
          height: buttonVars.sizeMedium.rest.icon.size,
          "--size": buttonVars.sizeMedium.rest.progressCircle.size,
          "--thickness": buttonVars.sizeMedium.rest.progressCircle.thickness,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.rest.root.height,
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,
        },
        decrementButton: {
          width: buttonVars.sizeLarge.rest.root.size,
          height: buttonVars.sizeLarge.rest.root.size,
          borderRadius: buttonVars.sizeLarge.rest.root.cornerRadius,
        },
        decrementIcon: {
          width: buttonVars.sizeLarge.rest.icon.size,
          height: buttonVars.sizeLarge.rest.icon.size,
          "--size": buttonVars.sizeLarge.rest.progressCircle.size,
          "--thickness": buttonVars.sizeLarge.rest.progressCircle.thickness,
        },
        valueDisplay: {
          paddingInline: vars.sizeLarge.rest.valueDisplay.paddingX,
          fontSize: vars.sizeLarge.rest.valueDisplay.fontSize,
          lineHeight: vars.sizeLarge.rest.valueDisplay.lineHeight,
        },
        divider: {
          width: vars.sizeLarge.rest.divider.width,
          height: vars.sizeLarge.rest.divider.height,
        },
        incrementButton: {
          width: buttonVars.sizeLarge.rest.root.size,
          height: buttonVars.sizeLarge.rest.root.size,
          borderRadius: buttonVars.sizeLarge.rest.root.cornerRadius,
        },
        incrementIcon: {
          width: buttonVars.sizeLarge.rest.icon.size,
          height: buttonVars.sizeLarge.rest.icon.size,
          "--size": buttonVars.sizeLarge.rest.progressCircle.size,
          "--thickness": buttonVars.sizeLarge.rest.progressCircle.thickness,
        },
      },
    },
  },
  defaultVariants: {
    layout: "hug",
    size: "medium",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default quantityPicker;

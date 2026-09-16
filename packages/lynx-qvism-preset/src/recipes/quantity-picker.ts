import spec from "@seed-design/rootage-artifacts/components/quantity-picker";
import { quantityPicker as vars, quantityPickerButton as buttonVars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";

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
      display: "flex",
      width: "fit-content",
      alignItems: "center",

      backgroundColor: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
    },
    decrementButton: {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      padding: 0,
      backgroundColor: buttonVars.base.enabled.root.color,
      transition: `background-color ${buttonVars.base.enabled.root.colorDuration} ${buttonVars.base.enabled.root.colorTimingFunction}`,
    },
    decrementIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: buttonVars.base.enabled.icon.color,
      "--track-color": buttonVars.base.enabled.progressCircle.trackColor,
      "--range-color": buttonVars.base.enabled.progressCircle.rangeColor,
    },
    valueDisplay: {
      display: "grid",
      flexGrow: 1,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",

      fontWeight: vars.base.enabled.valueDisplay.fontWeight,
      color: vars.base.enabled.valueDisplay.color,
    },
    valueDisplayPlaceholder: {
      gridColumnStart: "1",
      gridColumnEnd: "2",
      gridRowStart: "1",
      gridRowEnd: "2",
      visibility: "hidden",
    },
    valueDisplayText: {
      gridColumnStart: "1",
      gridColumnEnd: "2",
      gridRowStart: "1",
      gridRowEnd: "2",
      textAlign: "center",
    },
    divider: {
      flexShrink: 0,
      backgroundColor: vars.base.enabled.divider.color,
    },
    incrementButton: {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      padding: 0,
      backgroundColor: buttonVars.base.enabled.root.color,
      transition: `background-color ${buttonVars.base.enabled.root.colorDuration} ${buttonVars.base.enabled.root.colorTimingFunction}`,
    },
    incrementIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: buttonVars.base.enabled.icon.color,
      "--track-color": buttonVars.base.enabled.progressCircle.trackColor,
      "--range-color": buttonVars.base.enabled.progressCircle.rangeColor,
    },
  },
  variants: {
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
          paddingLeft: vars.sizeSmall.enabled.valueDisplay.paddingX,
          paddingRight: vars.sizeSmall.enabled.valueDisplay.paddingX,
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
          paddingLeft: vars.sizeMedium.enabled.valueDisplay.paddingX,
          paddingRight: vars.sizeMedium.enabled.valueDisplay.paddingX,
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
          paddingLeft: vars.sizeLarge.enabled.valueDisplay.paddingX,
          paddingRight: vars.sizeLarge.enabled.valueDisplay.paddingX,
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
    invalid: {
      true: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.base.invalid.root.strokeWidth} ${vars.base.invalid.root.strokeColor}`,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        decrementIcon: {
          color: buttonVars.base.disabled.icon.color,
        },
        valueDisplay: {
          color: vars.base.disabled.valueDisplay.color,
        },
        incrementIcon: {
          color: buttonVars.base.disabled.icon.color,
        },
      },
      false: {},
    },
    pressed: {
      true: {
        decrementButton: {
          backgroundColor: buttonVars.base.pressed.root.color,
        },
        incrementButton: {
          backgroundColor: buttonVars.base.pressed.root.color,
        },
      },
      false: {},
    },
    loading: {
      true: {
        decrementButton: {
          backgroundColor: buttonVars.base.loading.root.color,
        },
        incrementButton: {
          backgroundColor: buttonVars.base.loading.root.color,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      disabled: false,
      loading: false,
      css: {
        decrementButton: {
          "&:active": {
            backgroundColor: buttonVars.base.pressed.root.color,
          },
        },
        incrementButton: {
          "&:active": {
            backgroundColor: buttonVars.base.pressed.root.color,
          },
        },
      },
    },
  ],
  defaultVariants: {
    layout: "hug",
    size: "medium",
    invalid: false,
    disabled: false,
    pressed: false,
    loading: false,
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default quantityPicker;

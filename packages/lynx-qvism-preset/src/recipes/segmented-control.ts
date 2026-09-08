import {
  segmentedControlItem as itemVars,
  segmentedControl as vars,
  segmentedControlIndicator as indicatorVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const segmentedControl = defineSlotRecipe({
  name: "segmented-control",
  slots: ["root", "indicator", "item", "itemContent", "itemBackground", "label"],
  base: {
    root: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "1fr",
      gridAutoRows: "1fr",
      position: "relative",
      alignItems: "stretch",
      width: "max-content",
      maxWidth: "100%",
      padding: vars.base.enabled.root.padding,
      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,
    },
    indicator: {
      position: "absolute",
      top: vars.base.enabled.root.padding,
      bottom: vars.base.enabled.root.padding,
      left: vars.base.enabled.root.padding,
      zIndex: 0,
      width: `calc((100% - ${vars.base.enabled.root.padding} * 2) / var(--segment-count, 1))`,
      borderRadius: indicatorVars.base.enabled.root.cornerRadius,
      backgroundColor: indicatorVars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
      transform: "translateX(calc(var(--segment-index, 0) * 100%))",
      transitionProperty: "transform, opacity",
      transitionDuration: indicatorVars.base.enabled.root.transformDuration,
      transitionTimingFunction: indicatorVars.base.enabled.root.transformTimingFunction,
    },
    item: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      zIndex: 1,
      alignItems: "center",
      justifyContent: "center",
      minWidth: itemVars.base.enabled.root.minWidth,
      minHeight: itemVars.base.enabled.root.minHeight,
      height: "100%",
      borderRadius: itemVars.base.enabled.root.cornerRadius,
    },
    itemContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      gap: itemVars.base.enabled.root.gap,
      paddingLeft: itemVars.base.enabled.root.paddingX,
      paddingRight: itemVars.base.enabled.root.paddingX,
      paddingTop: itemVars.base.enabled.root.paddingY,
      paddingBottom: itemVars.base.enabled.root.paddingY,
    },
    itemBackground: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: itemVars.base.enabled.root.colorDuration,
      transitionTimingFunction: itemVars.base.enabled.root.colorTimingFunction,
    },
    label: {
      color: itemVars.base.enabled.label.color,
      fontWeight: itemVars.base.enabled.label.fontWeight,
      fontSize: itemVars.base.enabled.label.fontSize,
      lineHeight: itemVars.base.enabled.label.lineHeight,
      textAlign: "center",
      transitionProperty: "color",
      transitionDuration: itemVars.base.enabled.label.colorDuration,
      transitionTimingFunction: itemVars.base.enabled.label.colorTimingFunction,
    },
  },
  variants: {
    selected: {
      true: {
        itemBackground: {
          backgroundColor: indicatorVars.base.pressed.root.color,
          boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
        },
        label: {
          color: itemVars.base.selected.label.color,
        },
      },
      false: {
        itemBackground: {
          backgroundColor: itemVars.base.pressed.root.color,
          boxShadow: `inset 0 0 0 ${itemVars.base.pressed.root.strokeWidth} ${itemVars.base.pressed.root.strokeColor}`,
        },
      },
    },
    disabled: {
      true: {
        label: {
          color: itemVars.base.disabled.label.color,
        },
      },
      false: {
        item: {
          "&:active .seed-segmented-control__itemBackground": {
            opacity: 1,
          },
        },
      },
    },
    pressed: {
      true: {
        itemBackground: {
          opacity: 1,
        },
      },
      false: {},
    },
    hasSelection: {
      true: {},
      false: {
        indicator: {
          opacity: 0,
        },
      },
    },
  },
  compoundVariants: [
    {
      disabled: true,
      pressed: true,
      css: {
        itemBackground: {
          opacity: 0,
        },
      },
    },
    {
      selected: true,
      disabled: true,
      css: {
        item: {
          backgroundColor: indicatorVars.base.disabled.root.color,
          boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
        },
      },
    },
  ],
  defaultVariants: {
    selected: false,
    disabled: false,
    pressed: false,
    hasSelection: true,
  },
});

export default segmentedControl;

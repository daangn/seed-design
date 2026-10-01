import {
  segmentedControlItem as itemVars,
  segmentedControl as vars,
  segmentedControlIndicator as indicatorVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * 선택 전·후 눌림 색을 `itemBackground`·`itemSelectedBackground` 두 overlay에 고정하고
 * item의 `:active`에서 현재 선택 상태에 맞는 overlay의 opacity만 전환한다. 놓는 순간 선택이
 * 바뀌어도 사라지는 overlay의 색은 바뀌지 않는다.
 */
const segmentedControl = defineSlotRecipe({
  name: "segmented-control",
  slots: [
    "root",
    "indicator",
    "item",
    "itemContent",
    "itemBackground",
    "itemSelectedBackground",
    "label",
  ],
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
      backgroundColor: itemVars.base.pressed.root.color,
      boxShadow: `inset 0 0 0 ${itemVars.base.pressed.root.strokeWidth} ${itemVars.base.pressed.root.strokeColor}`,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: itemVars.base.enabled.root.colorDuration,
      transitionTimingFunction: itemVars.base.enabled.root.colorTimingFunction,
    },
    itemSelectedBackground: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      backgroundColor: indicatorVars.base.pressed.root.color,
      boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
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
        label: {
          color: itemVars.base.selected.label.color,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        label: {
          color: itemVars.base.disabled.label.color,
        },
      },
      false: {
        item: {
          "&:active .seed-segmented-control__itemBackground--selected_false": {
            opacity: 1,
          },
          "&:active .seed-segmented-control__itemSelectedBackground--selected_true": {
            opacity: 1,
          },
        },
      },
    },
    hasSelection: {
      true: {},
      false: {
        indicator: {
          opacity: 0,
        },
      },
    },
    transitionEnabled: {
      true: {},
      false: {
        indicator: {
          transitionDuration: "0s",
        },
      },
    },
  },
  compoundVariants: [
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
    hasSelection: true,
    transitionEnabled: true,
  },
});

export default segmentedControl;

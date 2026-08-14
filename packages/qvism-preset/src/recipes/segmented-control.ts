import {
  segmentedControlItem as itemVars,
  segmentedControl as vars,
  segmentedControlIndicator as indicatorVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, checked, disabled, focusVisible, not, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const segmentedControl = defineSlotRecipe({
  name: "segmented-control",
  slots: ["root", "indicator", "item"],
  base: {
    root: {
      display: "grid",
      boxSizing: "border-box",
      maxWidth: "100%",

      position: "relative",

      padding: vars.base.rest.root.padding,

      borderRadius: vars.base.rest.root.cornerRadius,

      backgroundColor: vars.base.rest.root.color,

      gridAutoFlow: "column",
      gridAutoColumns: "1fr",
      gridAutoRows: "1fr",

      alignItems: "center",

      isolation: "isolate",
    },
    indicator: {
      position: "absolute",
      zIndex: -1,
      willChange: "transform",
      transform: "translateX(calc(var(--segment-index) * 100%))",

      insetBlock: vars.base.rest.root.padding,
      left: vars.base.rest.root.padding,
      width: `calc((100% - ${vars.base.rest.root.padding} * 2) / var(--segment-count))`,

      borderRadius: indicatorVars.base.rest.root.cornerRadius,
      backgroundColor: indicatorVars.base.rest.root.color,

      boxShadow: `inset 0 0 0 ${indicatorVars.base.rest.root.strokeWidth} ${indicatorVars.base.rest.root.strokeColor}`,

      transition: `transform ${indicatorVars.base.rest.root.transformDuration} ${indicatorVars.base.rest.root.transformTimingFunction}`,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
      boxSizing: "border-box",
      overflowWrap: "break-word",

      minWidth: itemVars.base.rest.root.minWidth,
      minHeight: itemVars.base.rest.root.minHeight,

      gap: itemVars.base.rest.root.gap,

      // ensures every item has the height of the tallest item (e.g. item with 2+ lines of label)
      height: "100%",

      paddingInline: itemVars.base.rest.root.paddingX,
      paddingBlock: itemVars.base.rest.root.paddingY,
      borderRadius: itemVars.base.rest.root.cornerRadius,

      fontWeight: itemVars.base.rest.label.fontWeight,
      fontSize: itemVars.base.rest.label.fontSize,
      lineHeight: itemVars.base.rest.label.lineHeight,
      color: itemVars.base.rest.label.color,

      transition: `background-color ${itemVars.base.rest.root.colorDuration} ${itemVars.base.rest.root.colorTimingFunction}, color ${itemVars.base.rest.label.colorDuration} ${itemVars.base.rest.label.colorTimingFunction}, box-shadow ${itemVars.base.rest.root.colorDuration} ${itemVars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      [pseudo(checked)]: {
        color: itemVars.base.selected.label.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        color: itemVars.base.disabled.label.color,
      },

      [pseudo(disabled, checked)]: {
        // this covers the indicator
        backgroundColor: indicatorVars.base.disabled.root.color,

        // this is the same as the indicator stroke
        boxShadow: `inset 0 0 0 ${indicatorVars.base.rest.root.strokeWidth} ${indicatorVars.base.rest.root.strokeColor}`,
      },

      [pseudo(not(disabled), checked, engaged)]: {
        backgroundColor: indicatorVars.base.pressed.root.color,
        boxShadow: `inset 0 0 0 ${indicatorVars.base.rest.root.strokeWidth} ${indicatorVars.base.rest.root.strokeColor}`,
      },

      [pseudo(not(disabled), not(checked), engaged)]: {
        backgroundColor: itemVars.base.pressed.root.color,
        boxShadow: `inset 0 0 0 ${itemVars.base.pressed.root.strokeWidth} ${itemVars.base.pressed.root.strokeColor}`,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default segmentedControl;

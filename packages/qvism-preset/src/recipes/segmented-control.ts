import { segmentedControlItem as itemVars, segmentedControl as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, checked, disabled, not, pseudo } from "../utils/pseudo";

const segmentedControl = defineSlotRecipe({
  name: "segmented-control",
  slots: ["root", "indicator", "item"],
  base: {
    root: {
      display: "grid",
      boxSizing: "border-box",
      maxWidth: "100%",

      position: "relative",

      padding: vars.base.enabled.root.padding,

      borderRadius: vars.base.enabled.root.cornerRadius,

      backgroundColor: vars.base.enabled.root.color,

      gridAutoFlow: "column",
      gridAutoColumns: "1fr",

      alignItems: "center",

      isolation: "isolate",
    },
    indicator: {
      position: "absolute",
      zIndex: -1,
      willChange: "transform",
      transform: "translateX(calc(var(--segment-index) * 100%))",

      top: vars.base.enabled.root.padding,
      bottom: vars.base.enabled.root.padding,
      left: vars.base.enabled.root.padding,
      width: `calc((100% - ${vars.base.enabled.root.padding} * 2) / var(--segment-count))`,

      borderRadius: vars.base.enabled.indicator.cornerRadius,
      backgroundColor: vars.base.enabled.indicator.color,

      boxShadow: `${vars.base.enabled.indicator.shadow}, inset 0 0 0 ${vars.base.enabled.indicator.strokeWidth} ${vars.base.enabled.indicator.strokeColor}`,

      transition: `transform ${vars.base.enabled.indicator.transformDuration} ${vars.base.enabled.indicator.transformTimingFunction}`,
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

      minWidth: itemVars.base.enabled.root.minWidth,
      minHeight: itemVars.base.enabled.root.minHeight,

      gap: itemVars.base.enabled.root.gap,

      // ensures every item has the height of the tallest item (e.g. item with 2+ lines of label)
      height: "100%",

      paddingLeft: itemVars.base.enabled.root.paddingX,
      paddingRight: itemVars.base.enabled.root.paddingX,
      paddingTop: itemVars.base.enabled.root.paddingY,
      paddingBottom: itemVars.base.enabled.root.paddingY,
      borderRadius: itemVars.base.enabled.root.cornerRadius,

      fontWeight: itemVars.base.enabled.label.fontWeight,
      fontSize: itemVars.base.enabled.label.fontSize,
      lineHeight: itemVars.base.enabled.label.lineHeight,
      color: itemVars.base.enabled.label.color,

      transition: `background-color ${itemVars.base.enabled.root.colorDuration} ${itemVars.base.enabled.root.colorTimingFunction}, color ${itemVars.base.enabled.label.colorDuration} ${itemVars.base.enabled.label.colorTimingFunction}`,

      [pseudo(checked)]: {
        color: itemVars.base.selected.label.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        color: itemVars.base.disabled.label.color,
      },

      [pseudo(disabled, checked)]: {
        // this covers the indicator
        backgroundColor: itemVars.base.disabledSelected.root.color,

        // this is the same as the indicator stroke
        boxShadow: `inset 0 0 0 ${vars.base.enabled.indicator.strokeWidth} ${vars.base.enabled.indicator.strokeColor}`,
      },

      [pseudo(not(disabled), checked, active)]: {
        backgroundColor: itemVars.base.selectedPressed.root.color,
      },

      [pseudo(not(disabled), not(checked), active)]: {
        backgroundColor: itemVars.base.pressed.root.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default segmentedControl;

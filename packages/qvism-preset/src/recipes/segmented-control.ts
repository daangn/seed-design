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
      minWidth: "fit-content",
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

      insetBlock: vars.base.enabled.root.padding,
      insetInlineStart: vars.base.enabled.root.padding,
      width: `calc((100% - ${vars.base.enabled.root.padding} * 2) / var(--segment-count))`,

      borderRadius: vars.base.enabled.indicator.cornerRadius,
      backgroundColor: vars.base.enabled.indicator.color,
      boxShadow: vars.base.enabled.indicator.shadow,
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
      minHeight: itemVars.base.enabled.root.height,
      paddingInline: itemVars.base.enabled.root.paddingX,
      borderRadius: itemVars.base.enabled.root.cornerRadius,

      fontWeight: itemVars.base.enabled.label.fontWeight,
      fontSize: itemVars.base.enabled.label.fontSize,
      lineHeight: itemVars.base.enabled.label.lineHeight,
      color: itemVars.base.enabled.label.color,

      [pseudo(checked)]: {
        color: itemVars.base.selected.label.color,
        fontWeight: itemVars.base.selected.label.fontWeight,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        color: itemVars.base.disabled.label.color,
      },

      [pseudo(not(checked), active)]: {
        backgroundColor: itemVars.base.pressed.root.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default segmentedControl;

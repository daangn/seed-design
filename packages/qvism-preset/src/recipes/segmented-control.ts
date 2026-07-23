import {
  segmentedControlItem as itemVars,
  segmentedControl as vars,
  segmentedControlIndicator as indicatorVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, checked, disabled, focusVisible, not, pseudo } from "../utils/pseudo";
import {
  createPressScaleCounterRestStyles,
  createPressScaleCounterStyles,
  createPressScaleRestStyles,
  createPressScaleStyles,
  PRESS_SCALE_TRANSITION,
} from "../utils/press-scale";
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

      padding: vars.base.enabled.root.padding,

      borderRadius: vars.base.enabled.root.cornerRadius,

      backgroundColor: vars.base.enabled.root.color,

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

      insetBlock: vars.base.enabled.root.padding,
      left: vars.base.enabled.root.padding,
      width: `calc((100% - ${vars.base.enabled.root.padding} * 2) / var(--segment-count))`,

      borderRadius: indicatorVars.base.enabled.root.cornerRadius,
      backgroundColor: indicatorVars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,

      transition: `transform ${indicatorVars.base.enabled.root.transformDuration} ${indicatorVars.base.enabled.root.transformTimingFunction}`,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
      boxSizing: "border-box",

      // `anywhere`, not `break-word`: the label is passed as bare children, so it
      // sits in an anonymous flex item whose automatic minimum size refuses to go
      // below min-content. `break-word` breaks the token but leaves min-content at
      // the full word, so the anonymous item stays wide and the text escapes the
      // segment once the grid squeezes it to `minWidth`. Only `anywhere` lowers
      // min-content, which is what the removed inner layout slot's `min-width: 0`
      // used to achieve.
      overflowWrap: "anywhere",

      minWidth: itemVars.base.enabled.root.minWidth,
      minHeight: itemVars.base.enabled.root.minHeight,

      // ensures every item has the height of the tallest item (e.g. item with 2+ lines of label)
      height: "100%",

      paddingInline: itemVars.base.enabled.root.paddingX,
      paddingBlock: itemVars.base.enabled.root.paddingY,
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      gap: itemVars.base.enabled.root.gap,

      fontWeight: itemVars.base.enabled.label.fontWeight,
      fontSize: itemVars.base.enabled.label.fontSize,
      lineHeight: itemVars.base.enabled.label.lineHeight,
      color: itemVars.base.enabled.label.color,

      // The item scales as a whole on press; its pressed background lives on
      // ::before and cancels that scale, so the background keeps covering the
      // indicator sliding behind it instead of letting it peek out at the edges.
      position: "relative",
      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,
        borderRadius: "inherit",

        transition: `background-color ${itemVars.base.enabled.root.colorDuration} ${itemVars.base.enabled.root.colorTimingFunction}, box-shadow ${itemVars.base.enabled.root.colorDuration} ${itemVars.base.enabled.root.colorTimingFunction}, ${PRESS_SCALE_TRANSITION}`,

        ...createPressScaleCounterRestStyles(),
      },

      // The focus ring is an `outline`, so it is painted with whatever box it sits
      // on and inherits that box's scale. On the item itself it would shrink with
      // the content and detach inward from the fixed background; on this
      // counter-scaled layer it stays glued to it. ::after rather than ::before
      // because the background pseudo sits at `z-index: -1`, behind the content.
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",

        ...createFocusRingRestStyles(),
        transition: `${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,

        ...createPressScaleCounterRestStyles(),
      },

      transition: `color ${itemVars.base.enabled.label.colorDuration} ${itemVars.base.enabled.label.colorTimingFunction}, ${PRESS_SCALE_TRANSITION}`,

      [pseudo(checked)]: {
        color: itemVars.base.selected.label.color,
      },

      [pseudo(focusVisible, "::after")]: createFocusRingStyles(),

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        color: itemVars.base.disabled.label.color,
      },

      [pseudo(disabled, checked, "::before")]: {
        // this covers the indicator
        backgroundColor: indicatorVars.base.disabled.root.color,

        // this is the same as the indicator stroke
        boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
      },

      [pseudo(not(disabled), checked, engaged, "::before")]: {
        backgroundColor: indicatorVars.base.pressed.root.color,
        boxShadow: `inset 0 0 0 ${indicatorVars.base.enabled.root.strokeWidth} ${indicatorVars.base.enabled.root.strokeColor}`,
      },

      [pseudo(not(disabled), not(checked), engaged, "::before")]: {
        backgroundColor: itemVars.base.pressed.root.color,
        boxShadow: `inset 0 0 0 ${itemVars.base.pressed.root.strokeWidth} ${itemVars.base.pressed.root.strokeColor}`,
      },

      ...createPressScaleRestStyles(),
      [pseudo(not(disabled), active)]: createPressScaleStyles(),
      [pseudo(not(disabled), active, "::before")]: createPressScaleCounterStyles(),
      [pseudo(not(disabled), active, "::after")]: createPressScaleCounterStyles(),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default segmentedControl;

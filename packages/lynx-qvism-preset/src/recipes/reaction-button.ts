import { reactionButton as vars } from "../vars/component";
import * as duration from "../vars/duration";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";

import { defineSlotRecipe } from "../utils/define";
const ROOT_TRANSITION = `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, box-shadow ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, transform ${duration.pressedScale} ${timingFunction.pressedScale}`;
const ROOT_TRANSITION_WITHOUT_BACKGROUND = `box-shadow ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, transform ${duration.pressedScale} ${timingFunction.pressedScale}`;

const reactionButton = defineSlotRecipe({
  name: "reaction-button",
  slots: ["root", "content", "label", "count", "prefixIcon", "loadingIndicator"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
      transform: "scale(1)",
      "--track-color": vars.base.enabled.progressCircle.trackColor,
      "--range-color": vars.base.enabled.progressCircle.rangeColor,
      transition: ROOT_TRANSITION,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: 1,
    },
    label: {
      color: vars.base.enabled.label.color,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    count: {
      color: vars.base.enabled.count.color,
      fontWeight: vars.base.enabled.count.fontWeight,
    },
    prefixIcon: {
      color: vars.base.enabled.prefixIcon.color,
      flexShrink: 0,
    },
    loadingIndicator: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  variants: {
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,
          paddingLeft: vars.sizeXsmall.enabled.root.paddingX,
          paddingRight: vars.sizeXsmall.enabled.root.paddingX,
          paddingTop: vars.sizeXsmall.enabled.root.paddingY,
          paddingBottom: vars.sizeXsmall.enabled.root.paddingY,
        },
        content: {
          gap: vars.sizeXsmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeXsmall.enabled.label.fontSize,
          lineHeight: vars.sizeXsmall.enabled.label.lineHeight,
        },
        count: {
          fontSize: vars.sizeXsmall.enabled.count.fontSize,
          lineHeight: vars.sizeXsmall.enabled.count.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeXsmall.enabled.prefixIcon.size,
          height: vars.sizeXsmall.enabled.prefixIcon.size,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
          paddingLeft: vars.sizeSmall.enabled.root.paddingX,
          paddingRight: vars.sizeSmall.enabled.root.paddingX,
          paddingTop: vars.sizeSmall.enabled.root.paddingY,
          paddingBottom: vars.sizeSmall.enabled.root.paddingY,
        },
        content: {
          gap: vars.sizeSmall.enabled.root.gap,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
        },
        count: {
          fontSize: vars.sizeSmall.enabled.count.fontSize,
          lineHeight: vars.sizeSmall.enabled.count.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeSmall.enabled.prefixIcon.size,
          height: vars.sizeSmall.enabled.prefixIcon.size,
        },
      },
    },
    selected: {
      true: {
        root: {
          background: vars.base.selected.root.color,
          boxShadow: `inset 0 0 0 ${vars.base.selected.root.strokeWidth} ${vars.base.selected.root.strokeColor}`,
          "--track-color": vars.base.selected.progressCircle.trackColor,
          "--range-color": vars.base.selected.progressCircle.rangeColor,
        },
        label: { color: vars.base.selected.label.color },
        count: { color: vars.base.selected.count.color },
        prefixIcon: { color: vars.base.selected.prefixIcon.color },
      },
      false: {},
    },
    pressed: {
      true: {
        root: { background: vars.base.pressed.root.color },
      },
      false: {},
    },
    disabled: {
      true: {
        root: {
          background: vars.base.disabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.base.disabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        label: { color: vars.base.disabled.label.color },
        count: { color: vars.base.disabled.count.color },
        prefixIcon: { color: vars.base.disabled.prefixIcon.color },
      },
      false: {},
    },
    loading: {
      true: {
        root: {
          background: vars.base.loading.root.color,
          transition: ROOT_TRANSITION_WITHOUT_BACKGROUND,
        },
        content: { opacity: 0 },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      pressed: true,
      css: {
        root: { background: vars.base.selectedPressed.root.color },
      },
    },
    {
      size: "xsmall",
      pressed: true,
      css: {
        root: { transform: `scale(${scale.s95})` },
      },
    },
    {
      size: "small",
      pressed: true,
      css: {
        root: { transform: `scale(${scale.s97})` },
      },
    },
    {
      selected: true,
      pressed: false,
      loading: false,
      css: {
        root: { transition: ROOT_TRANSITION_WITHOUT_BACKGROUND },
      },
    },
    {
      selected: true,
      loading: true,
      css: {
        root: {
          background: vars.base.selectedLoading.root.color,
          boxShadow: `inset 0 0 0 ${vars.base.selectedLoading.root.strokeWidth} ${vars.base.selected.root.strokeColor}`,
          "--track-color": vars.base.selected.progressCircle.trackColor,
          "--range-color": vars.base.selected.progressCircle.rangeColor,
        },
      },
    },
  ],
  defaultVariants: {
    size: "small",
    selected: false,
    pressed: false,
    disabled: false,
    loading: false,
  },
});

export default reactionButton;

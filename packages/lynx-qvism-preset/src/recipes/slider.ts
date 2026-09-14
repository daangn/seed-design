import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import * as dimension from "../vars/dimension";
import { defineRecipe, defineSlotRecipe } from "../utils/define";

const slider = defineSlotRecipe({
  name: "slider",
  slots: [
    "root",
    "control",
    "track",
    "range",
    "thumb",
    "markers",
    "valueIndicatorRoot",
    "valueIndicatorArrow",
    "valueIndicatorLabel",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "100%",
      gap: vars.base.enabled.root.gap,
    },
    control: {
      position: "relative",
      height: vars.base.enabled.control.height,
      display: "flex",
      alignItems: "center",
    },
    track: {
      position: "relative",
      flexGrow: 1,
      height: vars.base.enabled.track.height,
      backgroundColor: vars.base.enabled.track.color,
      borderRadius: vars.base.enabled.track.cornerRadius,
      overflow: "hidden",
    },
    range: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "var(--slider-range-left, 0%)",
      width: "var(--slider-range-width, 0%)",
      backgroundColor: vars.base.enabled.range.color,
      borderRadius: vars.base.enabled.range.cornerRadius,
      transition: `left ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}, width ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}`,
    },
    thumb: {
      position: "absolute",
      top: "50%",
      left: "calc(var(--slider-thumb-left, 0%) + var(--slider-thumb-offset, 0px))",
      width: thumbVars.base.enabled.root.size,
      height: thumbVars.base.enabled.root.size,
      backgroundColor: thumbVars.base.enabled.root.color,
      borderRadius: thumbVars.base.enabled.root.cornerRadius,
      transform: "translate(-50%, -50%)",
      transition: `left ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}, transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}`,
    },
    markers: {
      position: "relative",
      height: vars.base.enabled.marker.lineHeight,
    },
    valueIndicatorRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      left: "calc(var(--slider-value-indicator-left, 0%) + var(--slider-value-indicator-offset, 0px))",
      background: vars.base.enabled.valueIndicatorRoot.color,
      paddingTop: vars.base.enabled.valueIndicatorRoot.paddingY,
      paddingRight: vars.base.enabled.valueIndicatorRoot.paddingX,
      paddingBottom: vars.base.enabled.valueIndicatorRoot.paddingY,
      paddingLeft: vars.base.enabled.valueIndicatorRoot.paddingX,
      borderRadius: vars.base.enabled.valueIndicatorRoot.cornerRadius,
      width: "max-content",
      minWidth: `calc(${vars.base.enabled.valueIndicatorRoot.paddingX} * 2 + ${vars.base.enabled.valueIndicatorArrow.width})`,
      flexShrink: 0,
      minHeight: `calc(${vars.base.enabled.valueIndicatorLabel.lineHeight} + ${vars.base.enabled.valueIndicatorRoot.paddingY} * 2)`,
      overflow: "visible",
      transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY})) scale(1)`,
      opacity: 0,
      transition: `opacity ${vars.base.enabled.valueIndicatorRoot.exitDuration} ${vars.base.enabled.valueIndicatorRoot.exitTimingFunction}, transform ${vars.base.enabled.valueIndicatorRoot.exitDuration} ${vars.base.enabled.valueIndicatorRoot.exitTimingFunction}`,
    },
    valueIndicatorArrow: {
      position: "absolute",
      top: "100%",
      left: "calc(50% + (var(--slider-thumb-offset, 0px) - var(--slider-value-indicator-offset, 0px)))",
      width: 0,
      height: 0,
      borderLeftWidth: dimension.x1,
      borderLeftStyle: "solid",
      borderLeftColor: "transparent",
      borderRightWidth: dimension.x1,
      borderRightStyle: "solid",
      borderRightColor: "transparent",
      borderTopWidth: vars.base.enabled.valueIndicatorArrow.height,
      borderTopStyle: "solid",
      borderTopColor: vars.base.enabled.valueIndicatorArrow.color,
      transform: "translateX(-50%)",
      transition: `left ${vars.base.enabled.valueIndicatorRoot.translateDuration} ${vars.base.enabled.valueIndicatorRoot.translateTimingFunction}`,
    },
    valueIndicatorLabel: {
      color: vars.base.enabled.valueIndicatorLabel.color,
      fontSize: vars.base.enabled.valueIndicatorLabel.fontSize,
      lineHeight: vars.base.enabled.valueIndicatorLabel.lineHeight,
      fontWeight: vars.base.enabled.valueIndicatorLabel.fontWeight,
      flexShrink: 0,
      whiteSpace: "nowrap",
      textAlign: "center",
    },
  },
  variants: {
    disabled: {
      true: {
        track: { backgroundColor: vars.base.disabled.track.color },
        range: { backgroundColor: vars.base.disabled.range.color },
        thumb: { backgroundColor: thumbVars.base.disabled.root.color },
        markers: { "--slider-marker-color": vars.base.disabled.marker.color },
      },
      false: {},
    },
    dragging: {
      true: {
        range: { transition: "none" },
        thumb: { transition: "none" },
        valueIndicatorArrow: { transition: "none" },
      },
      false: {},
    },
    thumbDragging: {
      true: {
        thumb: {
          transform: `translate(-50%, -50%) scale(${thumbVars.base.pressed.root.scale})`,
        },
      },
      false: {},
    },
    valueIndicatorShown: {
      true: {
        valueIndicatorRoot: {
          opacity: 1,
          transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY})) scale(1)`,
          transition: `opacity ${vars.base.enabled.valueIndicatorRoot.enterDuration} ${vars.base.enabled.valueIndicatorRoot.enterTimingFunction}, transform ${vars.base.enabled.valueIndicatorRoot.enterDuration} ${vars.base.enabled.valueIndicatorRoot.enterTimingFunction}`,
        },
      },
      false: {
        valueIndicatorRoot: {
          opacity: vars.base.enabled.valueIndicatorRoot.exitOpacity,
          // Match React's enter/exit motion by moving the hidden bubble closer to the thumb.
          transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 5px)) scale(${vars.base.enabled.valueIndicatorRoot.exitScale})`,
        },
      },
    },
    valueIndicatorEverShown: {
      true: {},
      false: {
        valueIndicatorRoot: {
          transitionDuration: "0s",
        },
      },
    },
  },
  defaultVariants: {
    disabled: false,
    dragging: false,
    thumbDragging: false,
    valueIndicatorShown: false,
    valueIndicatorEverShown: false,
  },
});

const sliderMarker = defineRecipe({
  name: "slider-marker",
  base: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "max-content",
    left: "calc(var(--slider-marker-left, 0%) + var(--slider-marker-offset, 0px))",
    color: "var(--slider-marker-color, var(--seed-color-fg-neutral-muted))",
    fontWeight: vars.base.enabled.marker.fontWeight,
    fontSize: vars.base.enabled.marker.fontSize,
    lineHeight: vars.base.enabled.marker.lineHeight,
  },
  variants: {
    align: {
      start: {},
      center: {},
      end: {},
    },
    dir: {
      ltr: {},
      rtl: {},
    },
    disabled: {
      true: {
        color: vars.base.disabled.marker.color,
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      align: "start",
      dir: "ltr",
      css: { textAlign: "left", transform: "translateX(0%)" },
    },
    {
      align: "center",
      dir: "ltr",
      css: { textAlign: "center", transform: "translateX(-50%)" },
    },
    {
      align: "end",
      dir: "ltr",
      css: { textAlign: "right", transform: "translateX(-100%)" },
    },
    {
      align: "start",
      dir: "rtl",
      css: { textAlign: "right", transform: "translateX(-100%)" },
    },
    {
      align: "center",
      dir: "rtl",
      css: { textAlign: "center", transform: "translateX(-50%)" },
    },
    {
      align: "end",
      dir: "rtl",
      css: { textAlign: "left", transform: "translateX(0%)" },
    },
  ],
  defaultVariants: {
    align: "center",
    dir: "ltr",
    disabled: false,
  },
});

const sliderTick = defineRecipe({
  name: "slider-tick",
  base: {
    position: "absolute",
    top: "50%",
    height: "100%",
    left: "calc(var(--slider-tick-left, 0%) + var(--slider-tick-offset, 0px))",
    backgroundColor: tickVars.base.enabled.root.color,
    transform: "translate(-50%, -50%)",
  },
  variants: {
    weight: {
      thin: {
        width: tickVars.weightThin.enabled.root.width,
      },
      thick: {
        width: tickVars.weightThick.enabled.root.width,
      },
    },
  },
  defaultVariants: {
    weight: "thin",
  },
});

export { slider, sliderMarker, sliderTick };

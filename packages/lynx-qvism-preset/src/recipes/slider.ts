import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
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
    "valueIndicatorMotion",
    "valueIndicatorRoot",
    "valueIndicatorArrow",
    "valueIndicatorArrowTip",
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
    valueIndicatorMotion: {
      display: "flex",
      alignItems: "flex-start",
      position: "absolute",
      top: "50%",
      left: "calc(var(--slider-value-indicator-left, 0%) + var(--slider-value-indicator-offset, 0px))",
      width: "max-content",
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      opacity: 0,
      // The wrapper is 16px taller than the body, so add 8px to preserve its origin.
      transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY} + 8px)) scale(1)`,
      transition: `opacity ${vars.base.enabled.valueIndicatorRoot.exitDuration} ${vars.base.enabled.valueIndicatorRoot.exitTimingFunction}, transform ${vars.base.enabled.valueIndicatorRoot.exitDuration} ${vars.base.enabled.valueIndicatorRoot.exitTimingFunction}`,
    },
    valueIndicatorRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
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
    },
    // Keep positioning separate from the tip's clipping path and the shared motion layer.
    valueIndicatorArrow: {
      position: "absolute",
      top: "100%",
      left: "calc(50% + (var(--slider-thumb-offset, 0px) - var(--slider-value-indicator-offset, 0px)))",
      width: vars.base.enabled.valueIndicatorArrow.width,
      height: vars.base.enabled.valueIndicatorArrow.width,
      overflow: "visible",
      transform: "translateX(-50%)",
      transition: `left ${vars.base.enabled.valueIndicatorRoot.translateDuration} ${vars.base.enabled.valueIndicatorRoot.translateTimingFunction}`,
    },
    valueIndicatorArrowTip: {
      width: vars.base.enabled.valueIndicatorArrow.width,
      height: `calc(${vars.base.enabled.valueIndicatorArrow.height} + 1px)`,
      backgroundColor: vars.base.enabled.valueIndicatorArrow.color,
      // React's 8×6 SVG with tipRadius=2, shifted down 1px to add a body overlap.
      // The curve stays unchanged below the join; only the top edge extends into the body.
      clipPath: 'path("M0 0 H8 V1 L6 5 Q4 7 2 5 L0 1 Z")',
      transform: "translateY(-1px)",
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
        valueIndicatorMotion: {
          opacity: 1,
          transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY} + 8px)) scale(1)`,
          transition: `opacity ${vars.base.enabled.valueIndicatorRoot.enterDuration} ${vars.base.enabled.valueIndicatorRoot.enterTimingFunction}, transform ${vars.base.enabled.valueIndicatorRoot.enterDuration} ${vars.base.enabled.valueIndicatorRoot.enterTimingFunction}`,
        },
      },
      false: {
        valueIndicatorMotion: {
          opacity: vars.base.enabled.valueIndicatorRoot.exitOpacity,
          // Match React's enter/exit motion by moving the hidden bubble closer to the thumb.
          transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 5px + 8px)) scale(${vars.base.enabled.valueIndicatorRoot.exitScale})`,
        },
      },
    },
    valueIndicatorEverShown: {
      true: {},
      false: {
        valueIndicatorMotion: {
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

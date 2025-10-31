import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { disabled, pseudo, focus, not, hidden } from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";

const dragging = "[data-dragging]";

const slider = defineSlotRecipe({
  name: "slider",
  slots: [
    "root",
    "track",
    "control",
    "range",
    "thumb",
    "tick",
    "markers",
    "marker",
    "tooltipRoot",
    "tooltipArrow",
    "tooltipArrowTip",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      width: "100%",

      gap: vars.base.enabled.root.gap,

      userSelect: "none",
      touchAction: "none",
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

      backgroundColor: vars.base.enabled.track.color,

      height: vars.base.enabled.track.height,

      borderRadius: vars.base.enabled.track.cornerRadius,
      overflow: "hidden",
    },
    range: {
      position: "absolute",

      height: "100%",

      backgroundColor: vars.base.enabled.range.color,

      left: "var(--range-left)",
      right: "var(--range-right)",

      transition: `left ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}, right ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}`,

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.range.color,
      },

      [pseudo(dragging)]: {
        transition: "none",
      },
    },
    thumb: {
      position: "absolute",
      top: "50%",

      left: "var(--thumb-left)",
      right: "var(--thumb-right)",

      transform: "translate(-50%, -50%)",

      width: thumbVars.base.enabled.root.size,
      height: thumbVars.base.enabled.root.size,
      backgroundColor: thumbVars.base.enabled.root.color,

      borderRadius: thumbVars.base.enabled.root.cornerRadius,

      transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}, left ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}, right ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}`,

      [pseudo(dragging)]: {
        transform: `translate(-50%, -50%) scale(${thumbVars.base.pressed.root.scale})`,

        transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}`,
      },

      [pseudo(focus)]: {
        outline: "none", // XXX
      },

      [pseudo(disabled)]: {
        backgroundColor: thumbVars.base.disabled.root.color,
      },

      [pseudo("[data-ssr]")]: {
        display: "none",
      },
    },
    markers: {
      position: "relative",

      // we set height here because all markers' position is absolute
      height: vars.base.enabled.marker.lineHeight,
    },
    marker: {
      position: "absolute",

      top: 0,
      bottom: 0,

      width: "max-content",

      left: "var(--marker-left)",
      right: "var(--marker-right)",
      transform: "var(--marker-transform)",
      textAlign: "var(--marker-text-align)",

      color: vars.base.enabled.marker.color,
      fontWeight: vars.base.enabled.marker.fontWeight,
      fontSize: vars.base.enabled.marker.fontSize,
      lineHeight: vars.base.enabled.marker.lineHeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.marker.color,
      },
    },
    tooltipRoot: {
      display: "flex",
      flexDirection: "column",
      background: vars.base.enabled.tooltipRoot.color,
      paddingInline: vars.base.enabled.tooltipRoot.paddingX,
      paddingBlock: vars.base.enabled.tooltipRoot.paddingY,
      borderRadius: vars.base.enabled.tooltipRoot.cornerRadius,

      color: vars.base.enabled.tooltipLabel.color,
      fontSize: vars.base.enabled.tooltipLabel.fontSize,
      lineHeight: vars.base.enabled.tooltipLabel.lineHeight,
      fontWeight: vars.base.enabled.tooltipLabel.fontWeight,

      whiteSpace: "pre-wrap",
      textAlign: "center",

      width: "max-content",

      position: "absolute",
      left: "var(--tooltip-left)",
      right: "var(--tooltip-right)",
      bottom: "100%",

      transform: `translate(var(--tooltip-translateX), calc(${vars.base.enabled.tooltipRoot.offsetY} * -1))`,

      [pseudo(dragging)]: {
        ...enterAnimation({
          scale: vars.base.enabled.tooltipRoot.enterScale,
          opacity: vars.base.enabled.tooltipRoot.enterOpacity,
          duration: vars.base.enabled.tooltipRoot.enterDuration,
          timingFunction: vars.base.enabled.tooltipRoot.enterTimingFunction,

          translateX: "var(--tooltip-translateX)",
          translateY: `calc((${thumbVars.base.pressed.root.scale} - 1) * ${thumbVars.base.enabled.root.size} / -2)`,
        }),
      },

      [pseudo(not(dragging))]: {
        ...exitAnimation({
          scale: vars.base.enabled.tooltipRoot.exitScale,
          opacity: vars.base.enabled.tooltipRoot.exitOpacity,
          duration: vars.base.enabled.tooltipRoot.exitDuration,
          timingFunction: vars.base.enabled.tooltipRoot.exitTimingFunction,

          translateX: "var(--tooltip-translateX)",
          translateY: `calc((${thumbVars.base.pressed.root.scale} - 1) * ${thumbVars.base.enabled.root.size} / -2)`,
        }),
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },
    },
    tooltipArrow: {
      width: vars.base.enabled.tooltipArrow.width,
      // we're making it square
      height: vars.base.enabled.tooltipArrow.width,

      position: "absolute",

      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    tooltipArrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.enabled.tooltipArrow.color,

      width: vars.base.enabled.tooltipArrow.width,
      height: vars.base.enabled.tooltipArrow.height,
    },
  },
  variants: {},
  defaultVariants: {},
});

const sliderTick = defineRecipe({
  name: "slider-tick",
  base: {
    position: "absolute",

    top: "50%",
    left: "var(--tick-left)",
    right: "var(--tick-right)",
    transform: "var(--tick-transform)",

    height: "100%",

    backgroundColor: tickVars.base.enabled.root.color,
  },
  variants: {
    variant: {
      thin: {
        width: tickVars.variantThin.enabled.root.width,
      },
      thick: {
        width: tickVars.variantThick.enabled.root.width,
      },
    },
  },
  defaultVariants: {
    variant: "thin",
  },
});

export { slider, sliderTick };

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
    "popoverRoot",
    "popoverArrow",
    "popoverArrowTip",
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

      // inset-block: chrome 87~
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

      // transform: "translate(var(--thumb-translateX), -50%)",

      left: "var(--thumb-left)",
      right: "var(--thumb-right)",

      transform: "translate(-50%, -50%)",

      width: thumbVars.base.enabled.root.size,
      height: thumbVars.base.enabled.root.size,
      backgroundColor: thumbVars.base.enabled.root.color,

      borderRadius: thumbVars.base.enabled.root.cornerRadius,

      // transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}`,

      transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}, left ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}, right ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}`,

      [pseudo(dragging)]: {
        // transform: `translate(var(--thumb-translateX), -50%) scale(${thumbVars.base.pressed.root.scale})`,
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
    popoverRoot: {
      display: "flex",
      flexDirection: "column",
      background: vars.base.enabled.popoverRoot.color,
      paddingInline: vars.base.enabled.popoverRoot.paddingX,
      paddingBlock: vars.base.enabled.popoverRoot.paddingY,
      borderRadius: vars.base.enabled.popoverRoot.cornerRadius,

      color: vars.base.enabled.popoverLabel.color,
      fontSize: vars.base.enabled.popoverLabel.fontSize,
      lineHeight: vars.base.enabled.popoverLabel.lineHeight,
      fontWeight: vars.base.enabled.popoverLabel.fontWeight,

      width: "max-content",

      position: "absolute",
      left: "var(--popover-left)",
      right: "var(--popover-right)",
      bottom: "100%",

      transform: `translate(-50%, calc(${vars.base.enabled.popoverRoot.offsetY} * -1))`,

      [pseudo(dragging)]: {
        ...enterAnimation({
          scale: vars.base.enabled.popoverRoot.enterScale,
          opacity: vars.base.enabled.popoverRoot.enterOpacity,
          duration: vars.base.enabled.popoverRoot.enterDuration,
          timingFunction: vars.base.enabled.popoverRoot.enterTimingFunction,

          translateX: "-50%",
          translateY: `calc((${thumbVars.base.pressed.root.scale} - 1) * ${thumbVars.base.enabled.root.size} / -2)`,
        }),
      },

      [pseudo(not(dragging))]: {
        ...exitAnimation({
          scale: vars.base.enabled.popoverRoot.exitScale,
          opacity: vars.base.enabled.popoverRoot.exitOpacity,
          duration: vars.base.enabled.popoverRoot.exitDuration,
          timingFunction: vars.base.enabled.popoverRoot.exitTimingFunction,

          translateX: "-50%",
          translateY: `calc((${thumbVars.base.pressed.root.scale} - 1) * ${thumbVars.base.enabled.root.size} / -2)`,
        }),
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },
    },
    popoverArrow: {
      width: vars.base.enabled.popoverArrow.width,
      // we're making it square
      height: vars.base.enabled.popoverArrow.width,

      position: "absolute",

      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    popoverArrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.enabled.popoverArrow.color,

      width: vars.base.enabled.popoverArrow.width,
      height: vars.base.enabled.popoverArrow.height,
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

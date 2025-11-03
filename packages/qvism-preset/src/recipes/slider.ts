import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { disabled, pseudo, focus, not, hidden } from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

const dragging = "[data-dragging]";
const thumbDragging = "[data-thumb-dragging]";

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

      // Always use left/right for range (smoother transition with two thumbs)
      left: "var(--left)",
      right: "var(--right)",

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

      width: thumbVars.base.enabled.root.size,
      height: thumbVars.base.enabled.root.size,

      transform: "translate(-50%, -50%)",

      // opacity transition is only for web so isn't defined in rootage
      transition: `left ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}, right ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}, opacity ${duration.d2} ${timingFunction.easing}`,

      [pseudo("[data-ssr]")]: {
        opacity: 0,
      },

      [pseudo("[data-dir='ltr']")]: {
        left: "calc(var(--thumb-position) * 1% + var(--thumb-offset))",
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(var(--thumb-position) * 1% + var(--thumb-offset))",
      },

      "&::after": {
        content: '""',
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: thumbVars.base.enabled.root.color,
        borderRadius: thumbVars.base.enabled.root.cornerRadius,

        transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}`,
      },

      [pseudo(disabled)]: {
        "&::after": {
          backgroundColor: thumbVars.base.disabled.root.color,
        },
      },

      [pseudo(dragging)]: {
        transition: "none",
      },

      [pseudo(thumbDragging)]: {
        "&::after": {
          transform: `scale(${thumbVars.base.pressed.root.scale})`,
        },
      },

      [pseudo(focus)]: {
        outline: "none", // XXX
      },
    },
    markers: {
      position: "relative",

      // we set height here because all markers' position is absolute
      height: vars.base.enabled.marker.lineHeight,
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
      bottom: `calc(100% + ${vars.base.enabled.tooltipRoot.offsetY})`,

      opacity: 0,

      [pseudo("[data-dir='ltr']")]: {
        left: "calc(var(--tooltip-position) * 1% + var(--tooltip-offset))",
        transform: "translateX(-50%)",
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(var(--tooltip-position) * 1% + var(--tooltip-offset))",
        transform: "translateX(50%)",
      },

      [pseudo(thumbDragging)]: {
        opacity: 1,
      },

      [pseudo(thumbDragging, "[data-dir='ltr']")]: {
        ...enterAnimation({
          scale: vars.base.enabled.tooltipRoot.enterScale,
          opacity: vars.base.enabled.tooltipRoot.enterOpacity,
          duration: vars.base.enabled.tooltipRoot.enterDuration,
          timingFunction: vars.base.enabled.tooltipRoot.enterTimingFunction,

          translateX: "-50%",
          translateY: vars.base.enabled.tooltipRoot.offsetY,
        }),
      },

      [pseudo(thumbDragging, "[data-dir='rtl']")]: {
        ...enterAnimation({
          scale: vars.base.enabled.tooltipRoot.enterScale,
          opacity: vars.base.enabled.tooltipRoot.enterOpacity,
          duration: vars.base.enabled.tooltipRoot.enterDuration,
          timingFunction: vars.base.enabled.tooltipRoot.enterTimingFunction,

          translateX: "50%",
          translateY: vars.base.enabled.tooltipRoot.offsetY,
        }),
      },

      [pseudo(not(thumbDragging), "[data-dir='ltr']")]: {
        ...exitAnimation({
          scale: vars.base.enabled.tooltipRoot.exitScale,
          opacity: vars.base.enabled.tooltipRoot.exitOpacity,
          duration: vars.base.enabled.tooltipRoot.exitDuration,
          timingFunction: vars.base.enabled.tooltipRoot.exitTimingFunction,

          translateX: "-50%",
          translateY: vars.base.enabled.tooltipRoot.offsetY,
        }),
      },

      [pseudo(not(thumbDragging), "[data-dir='rtl']")]: {
        ...exitAnimation({
          scale: vars.base.enabled.tooltipRoot.exitScale,
          opacity: vars.base.enabled.tooltipRoot.exitOpacity,
          duration: vars.base.enabled.tooltipRoot.exitDuration,
          timingFunction: vars.base.enabled.tooltipRoot.exitTimingFunction,

          translateX: "50%",
          translateY: vars.base.enabled.tooltipRoot.offsetY,
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

const sliderMarker = defineRecipe({
  name: "slider-marker",
  base: {
    position: "absolute",

    top: 0,
    bottom: 0,

    width: "max-content",

    color: vars.base.enabled.marker.color,
    fontWeight: vars.base.enabled.marker.fontWeight,
    fontSize: vars.base.enabled.marker.fontSize,
    lineHeight: vars.base.enabled.marker.lineHeight,

    [pseudo("[data-dir='ltr']")]: {
      left: "calc(var(--marker-position) * 1% + var(--marker-offset))",
    },
    [pseudo("[data-dir='rtl']")]: {
      right: "calc(var(--marker-position) * 1% + var(--marker-offset))",
    },

    [pseudo(disabled)]: {
      color: vars.base.disabled.marker.color,
    },
  },
  variants: {
    align: {
      start: {
        [pseudo("[data-dir='ltr']")]: {
          textAlign: "left",
        },
        [pseudo("[data-dir='rtl']")]: {
          textAlign: "right",
        },
      },
      center: {
        textAlign: "center",

        [pseudo("[data-dir='ltr']")]: {
          transform: "translateX(-50%)",
        },
        [pseudo("[data-dir='rtl']")]: {
          transform: "translateX(50%)",
        },
      },
      end: {
        [pseudo("[data-dir='ltr']")]: {
          textAlign: "right",
          transform: "translateX(-100%)",
        },
        [pseudo("[data-dir='rtl']")]: {
          textAlign: "left",
          transform: "translateX(100%)",
        },
      },
    },
  },
  defaultVariants: {
    align: "center",
  },
});

const sliderTick = defineRecipe({
  name: "slider-tick",
  base: {
    position: "absolute",

    top: "50%",

    height: "100%",

    backgroundColor: tickVars.base.enabled.root.color,

    transform: "translate(-50%, -50%)",

    [pseudo("[data-dir='ltr']")]: {
      left: "calc(var(--tick-position) * 1% + var(--tick-offset))",
    },
    [pseudo("[data-dir='rtl']")]: {
      right: "calc(var(--tick-position) * 1% + var(--tick-offset))",
    },
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

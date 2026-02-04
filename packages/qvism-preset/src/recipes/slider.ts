import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { disabled, pseudo, focus, not } from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";
import * as duration from "../vars/duration";
import * as timingFunction from "../vars/timing-function";

const dragging = "[data-dragging]";
const thumbDragging = "[data-thumb-dragging]";
const valueIndicatorShown = "[data-value-indicator-shown]";

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
    "valueIndicatorRoot",
    "valueIndicatorArrow",
    "valueIndicatorArrowTip",
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

      transition: `left ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}, right ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}`,
      willChange: "left, right",

      [pseudo("[data-dir='ltr']")]: {
        left: "var(--range-start)",
        right: "var(--range-end)",
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "var(--range-start)",
        left: "var(--range-end)",
      },

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
      willChange: "left, right, opacity",

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
        willChange: "transform",
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
    valueIndicatorRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      position: "absolute",
      top: "50%",

      boxSizing: "border-box",
      background: vars.base.enabled.valueIndicatorRoot.color,

      paddingLeft: vars.base.enabled.valueIndicatorRoot.paddingX,
      paddingRight: vars.base.enabled.valueIndicatorRoot.paddingX,
      paddingTop: vars.base.enabled.valueIndicatorRoot.paddingY,
      paddingBottom: vars.base.enabled.valueIndicatorRoot.paddingY,

      borderRadius: vars.base.enabled.valueIndicatorRoot.cornerRadius,

      color: vars.base.enabled.valueIndicatorLabel.color,
      fontSize: vars.base.enabled.valueIndicatorLabel.fontSize,
      lineHeight: vars.base.enabled.valueIndicatorLabel.lineHeight,
      fontWeight: vars.base.enabled.valueIndicatorLabel.fontWeight,

      whiteSpace: "pre-wrap",
      textAlign: "center",

      width: "max-content",
      minWidth: `calc(${vars.base.enabled.valueIndicatorRoot.paddingX} * 2 + ${vars.base.enabled.valueIndicatorArrow.width})`,

      [pseudo("[data-dir='ltr']")]: {
        left: "calc(var(--indicator-label-position) * 1% + var(--indicator-label-offset))",
        transform: `translate(-50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY}))`,
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(var(--indicator-label-position) * 1% + var(--indicator-label-offset))",
        transform: `translate(50%, calc(-100% - ${vars.base.enabled.thumb.size} / 2 - ${vars.base.enabled.valueIndicatorRoot.offsetY}))`,
      },

      [pseudo(valueIndicatorShown, "[data-dir='ltr']")]: {
        ...enterAnimation({
          scale: vars.base.enabled.valueIndicatorRoot.enterScale,
          opacity: vars.base.enabled.valueIndicatorRoot.enterOpacity,
          duration: vars.base.enabled.valueIndicatorRoot.enterDuration,
          timingFunction: vars.base.enabled.valueIndicatorRoot.enterTimingFunction,

          translateX: "-50%",
          // TODO: make 0.3125rem a rootage constant
          translateY: `calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(valueIndicatorShown, "[data-dir='rtl']")]: {
        ...enterAnimation({
          scale: vars.base.enabled.valueIndicatorRoot.enterScale,
          opacity: vars.base.enabled.valueIndicatorRoot.enterOpacity,
          duration: vars.base.enabled.valueIndicatorRoot.enterDuration,
          timingFunction: vars.base.enabled.valueIndicatorRoot.enterTimingFunction,

          translateX: "50%",
          translateY: `calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(not(valueIndicatorShown), "[data-dir='ltr']")]: {
        ...exitAnimation({
          scale: vars.base.enabled.valueIndicatorRoot.exitScale,
          opacity: vars.base.enabled.valueIndicatorRoot.exitOpacity,
          duration: vars.base.enabled.valueIndicatorRoot.exitDuration,
          timingFunction: vars.base.enabled.valueIndicatorRoot.exitTimingFunction,

          translateX: "-50%",
          translateY: `calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(not(valueIndicatorShown), "[data-dir='rtl']")]: {
        ...exitAnimation({
          scale: vars.base.enabled.valueIndicatorRoot.exitScale,
          opacity: vars.base.enabled.valueIndicatorRoot.exitOpacity,
          duration: vars.base.enabled.valueIndicatorRoot.exitDuration,
          timingFunction: vars.base.enabled.valueIndicatorRoot.exitTimingFunction,

          translateX: "50%",
          translateY: `calc(-100% - ${vars.base.enabled.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      // Prevent animation when indicator has never been shown
      [pseudo(not(valueIndicatorShown), not("[data-indicator-ever-shown]"))]: {
        animationDuration: "0s",
      },
    },
    valueIndicatorArrow: {
      width: vars.base.enabled.valueIndicatorArrow.width,
      // we're making it square
      height: vars.base.enabled.valueIndicatorArrow.width,

      position: "absolute",
      top: "100%",

      // Center horizontally with offset to align with thumb
      [pseudo("[data-dir='ltr']")]: {
        left: "calc(50% + (var(--thumb-offset) - var(--indicator-label-offset)))",
        transform: "translateX(-50%)",
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(50% + (var(--thumb-offset) - var(--indicator-label-offset)))",
        transform: "translateX(50%)",
      },
    },
    valueIndicatorArrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.enabled.valueIndicatorArrow.color,

      width: vars.base.enabled.valueIndicatorArrow.width,
      height: vars.base.enabled.valueIndicatorArrow.height,
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

import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { disabled, pseudo, focusVisible, focus, not } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
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

      gap: vars.base.rest.root.gap,

      userSelect: "none",
      touchAction: "none",

      [pseudo(dragging)]: {
        cursor: "grabbing",
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    control: {
      position: "relative",

      height: vars.base.rest.control.height,

      display: "flex",
      alignItems: "center",
    },
    track: {
      position: "relative",

      flexGrow: 1,

      backgroundColor: vars.base.rest.track.color,

      height: vars.base.rest.track.height,

      borderRadius: vars.base.rest.track.cornerRadius,
      overflow: "hidden",

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.track.color,
      },
    },
    range: {
      position: "absolute",

      height: "100%",

      backgroundColor: vars.base.rest.range.color,

      transition: `left ${vars.base.rest.range.widthDuration} ${vars.base.rest.range.widthTimingFunction}, right ${vars.base.rest.range.widthDuration} ${vars.base.rest.range.widthTimingFunction}`,
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

      width: thumbVars.base.rest.root.size,
      height: thumbVars.base.rest.root.size,

      transform: "translate(-50%, -50%)",

      // opacity transition is only for web so isn't defined in rootage
      transition: `left ${thumbVars.base.rest.root.translateDuration} ${thumbVars.base.rest.root.translateTimingFunction}, right ${thumbVars.base.rest.root.translateDuration} ${thumbVars.base.rest.root.translateTimingFunction}, opacity ${duration.d2} ${timingFunction.easing}`,
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

        inset: 0,

        backgroundColor: thumbVars.base.rest.root.color,
        borderRadius: thumbVars.base.rest.root.cornerRadius,

        ...createFocusRingRestStyles(),
        transition: `transform ${thumbVars.base.rest.root.scaleDuration} ${thumbVars.base.rest.root.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,
        willChange: "transform",

        cursor: "grab",
      },

      [pseudo(disabled)]: {
        "&::after": {
          backgroundColor: thumbVars.base.disabled.root.color,
          cursor: "not-allowed",
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
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&::after": createFocusRingStyles(),
      },
    },
    markers: {
      position: "relative",

      // we set height here because all markers' position is absolute
      height: vars.base.rest.marker.lineHeight,
    },
    valueIndicatorRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      position: "absolute",
      top: "50%",

      boxSizing: "border-box",

      transition: `left ${vars.base.rest.valueIndicatorRoot.translateDuration} ${vars.base.rest.valueIndicatorRoot.translateTimingFunction}, right ${vars.base.rest.valueIndicatorRoot.translateDuration} ${vars.base.rest.valueIndicatorRoot.translateTimingFunction}`,
      willChange: "left, right",

      background: vars.base.rest.valueIndicatorRoot.color,

      paddingInline: vars.base.rest.valueIndicatorRoot.paddingX,
      paddingBlock: vars.base.rest.valueIndicatorRoot.paddingY,

      borderRadius: vars.base.rest.valueIndicatorRoot.cornerRadius,

      color: vars.base.rest.valueIndicatorLabel.color,
      fontSize: vars.base.rest.valueIndicatorLabel.fontSize,
      lineHeight: vars.base.rest.valueIndicatorLabel.lineHeight,
      fontWeight: vars.base.rest.valueIndicatorLabel.fontWeight,

      whiteSpace: "pre-wrap",
      textAlign: "center",

      width: "max-content",
      minWidth: `calc(${vars.base.rest.valueIndicatorRoot.paddingX} * 2 + ${vars.base.rest.valueIndicatorArrow.width})`,

      [pseudo("[data-dir='ltr']")]: {
        left: "calc(var(--indicator-label-position) * 1% + var(--indicator-label-offset))",
        transform: `translate(-50%, calc(-100% - ${vars.base.rest.thumb.size} / 2 - ${vars.base.rest.valueIndicatorRoot.offsetY}))`,
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(var(--indicator-label-position) * 1% + var(--indicator-label-offset))",
        transform: `translate(50%, calc(-100% - ${vars.base.rest.thumb.size} / 2 - ${vars.base.rest.valueIndicatorRoot.offsetY}))`,
      },

      [pseudo(valueIndicatorShown, "[data-dir='ltr']")]: {
        ...enterAnimation({
          scale: vars.base.rest.valueIndicatorRoot.enterScale,
          opacity: vars.base.rest.valueIndicatorRoot.enterOpacity,
          duration: vars.base.rest.valueIndicatorRoot.enterDuration,
          timingFunction: vars.base.rest.valueIndicatorRoot.enterTimingFunction,

          translateX: "-50%",
          // TODO: make 0.3125rem a rootage constant
          translateY: `calc(-100% - ${vars.base.rest.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(valueIndicatorShown, "[data-dir='rtl']")]: {
        ...enterAnimation({
          scale: vars.base.rest.valueIndicatorRoot.enterScale,
          opacity: vars.base.rest.valueIndicatorRoot.enterOpacity,
          duration: vars.base.rest.valueIndicatorRoot.enterDuration,
          timingFunction: vars.base.rest.valueIndicatorRoot.enterTimingFunction,

          translateX: "50%",
          translateY: `calc(-100% - ${vars.base.rest.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(not(valueIndicatorShown), "[data-dir='ltr']")]: {
        ...exitAnimation({
          scale: vars.base.rest.valueIndicatorRoot.exitScale,
          opacity: vars.base.rest.valueIndicatorRoot.exitOpacity,
          duration: vars.base.rest.valueIndicatorRoot.exitDuration,
          timingFunction: vars.base.rest.valueIndicatorRoot.exitTimingFunction,

          translateX: "-50%",
          translateY: `calc(-100% - ${vars.base.rest.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(not(valueIndicatorShown), "[data-dir='rtl']")]: {
        ...exitAnimation({
          scale: vars.base.rest.valueIndicatorRoot.exitScale,
          opacity: vars.base.rest.valueIndicatorRoot.exitOpacity,
          duration: vars.base.rest.valueIndicatorRoot.exitDuration,
          timingFunction: vars.base.rest.valueIndicatorRoot.exitTimingFunction,

          translateX: "50%",
          translateY: `calc(-100% - ${vars.base.rest.thumb.size} / 2 - 0.3125rem)`,
        }),
      },

      [pseudo(dragging)]: {
        transition: "none",
      },

      // Prevent animation when indicator has never been shown
      [pseudo(not(valueIndicatorShown), not("[data-indicator-ever-shown]"))]: {
        animationDuration: "0s",
      },
    },
    valueIndicatorArrow: {
      width: vars.base.rest.valueIndicatorArrow.width,
      // we're making it square
      height: vars.base.rest.valueIndicatorArrow.width,

      position: "absolute",
      top: "100%",

      transition: `left ${vars.base.rest.valueIndicatorRoot.translateDuration} ${vars.base.rest.valueIndicatorRoot.translateTimingFunction}, right ${vars.base.rest.valueIndicatorRoot.translateDuration} ${vars.base.rest.valueIndicatorRoot.translateTimingFunction}`,
      willChange: "left, right",

      // Center horizontally with offset to align with thumb
      [pseudo("[data-dir='ltr']")]: {
        left: "calc(50% + (var(--thumb-offset) - var(--indicator-label-offset)))",
        transform: "translateX(-50%)",
      },

      [pseudo("[data-dir='rtl']")]: {
        right: "calc(50% + (var(--thumb-offset) - var(--indicator-label-offset)))",
        transform: "translateX(50%)",
      },

      [pseudo(dragging)]: {
        transition: "none",
      },
    },
    valueIndicatorArrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.rest.valueIndicatorArrow.color,

      width: vars.base.rest.valueIndicatorArrow.width,
      height: vars.base.rest.valueIndicatorArrow.height,
    },
  },
  variants: {},
  defaultVariants: {},
});

const sliderMarker = defineRecipe({
  name: "slider-marker",
  base: {
    position: "absolute",

    insetBlock: 0,

    width: "max-content",

    color: vars.base.rest.marker.color,
    fontWeight: vars.base.rest.marker.fontWeight,
    fontSize: vars.base.rest.marker.fontSize,
    lineHeight: vars.base.rest.marker.lineHeight,

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

    backgroundColor: tickVars.base.rest.root.color,

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
        width: tickVars.weightThin.rest.root.width,
      },
      thick: {
        width: tickVars.weightThick.rest.root.width,
      },
    },
  },
  defaultVariants: {
    weight: "thin",
  },
});

export { slider, sliderMarker, sliderTick };

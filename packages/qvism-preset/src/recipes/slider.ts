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

      // SSR/before measurement: use left/right
      "[data-ssr][data-dir='ltr'] &": {
        left: "calc(var(--thumb-position) * 1% + var(--thumb-offset))",
        transform: "translate(-50%, -50%)",
      },

      "[data-ssr][data-dir='rtl'] &": {
        right: "calc(var(--thumb-position) * 1% + var(--thumb-offset))",
        transform: "translate(-50%, -50%)",
      },

      // After measurement: use transform (--root-width is available)
      [pseudo(not("[data-ssr]"))]: {
        transform:
          "translateX(calc(var(--direction) * (var(--root-width) * var(--thumb-position) / 100 + var(--thumb-offset)))) translateX(-50%) translateY(-50%)",

        transition: `transform ${thumbVars.base.enabled.root.translateDuration} ${thumbVars.base.enabled.root.translateTimingFunction}`,
      },

      "&::after": {
        content: '""',
        position: "absolute",

        width: "100%",
        height: "100%",

        backgroundColor: thumbVars.base.enabled.root.color,
        borderRadius: thumbVars.base.enabled.root.cornerRadius,

        transition: `transform ${thumbVars.base.enabled.root.scaleDuration} ${thumbVars.base.enabled.root.scaleTimingFunction}`,

        [pseudo(disabled)]: {
          backgroundColor: thumbVars.base.disabled.root.color,
        },
      },

      [pseudo(dragging)]: {
        transition: "none",

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
    marker: {
      position: "absolute",

      top: 0,
      bottom: 0,

      width: "max-content",

      textAlign: "var(--marker-text-align)",

      color: vars.base.enabled.marker.color,
      fontWeight: vars.base.enabled.marker.fontWeight,
      fontSize: vars.base.enabled.marker.fontSize,
      lineHeight: vars.base.enabled.marker.lineHeight,

      // SSR/before measurement: use left/right (percentage-based)
      "[data-ssr][data-dir='ltr'] &": {
        left: "calc(var(--marker-position) * 1% + var(--marker-offset))",
        transform: "translateX(var(--marker-align-offset))",
      },

      "[data-ssr][data-dir='rtl'] &": {
        right: "calc(var(--marker-position) * 1% + var(--marker-offset))",
        transform: "translateX(calc(var(--marker-align-offset) * -1))",
      },

      // After measurement: use transform (pixel-based)
      [pseudo(not("[data-ssr]"))]: {
        transform:
          "translateX(calc(var(--direction) * (var(--root-width) * var(--marker-position) / 100 + var(--marker-offset)))) translateX(calc(var(--direction) * var(--marker-align-offset)))",
      },

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
      bottom: "100%",

      transform: `translateX(calc(var(--direction) * (var(--root-width) * var(--tooltip-position) / 100 + var(--tooltip-offset)))) translateX(calc(var(--direction) * -50%)) translateY(calc(${vars.base.enabled.tooltipRoot.offsetY} * -1))`,

      // Hide tooltip by default (before any interaction)
      opacity: 0,

      [pseudo(dragging)]: {
        opacity: 1,
        ...enterAnimation({
          scale: vars.base.enabled.tooltipRoot.enterScale,
          opacity: vars.base.enabled.tooltipRoot.enterOpacity,
          duration: vars.base.enabled.tooltipRoot.enterDuration,
          timingFunction: vars.base.enabled.tooltipRoot.enterTimingFunction,

          translateX:
            "calc(var(--direction) * (var(--root-width) * var(--tooltip-position) / 100 + var(--tooltip-offset)) + var(--direction) * -50%)",
          translateY: vars.base.enabled.tooltipRoot.offsetY,
        }),
      },

      [pseudo(not(dragging))]: {
        ...exitAnimation({
          scale: vars.base.enabled.tooltipRoot.exitScale,
          opacity: vars.base.enabled.tooltipRoot.exitOpacity,
          duration: vars.base.enabled.tooltipRoot.exitDuration,
          timingFunction: vars.base.enabled.tooltipRoot.exitTimingFunction,

          translateX:
            "calc(var(--direction) * (var(--root-width) * var(--tooltip-position) / 100 + var(--tooltip-offset)) + var(--direction) * -50%)",
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

const sliderTick = defineRecipe({
  name: "slider-tick",
  base: {
    position: "absolute",

    top: "50%",

    height: "100%",

    backgroundColor: tickVars.base.enabled.root.color,

    // SSR/before measurement: use left/right (percentage-based)
    "[data-ssr][data-dir='ltr'] &": {
      left: "calc(var(--tick-position) * 1% + var(--tick-offset))",
      transform: "translate(-50%, -50%)",
    },

    "[data-ssr][data-dir='rtl'] &": {
      right: "calc(var(--tick-position) * 1% + var(--tick-offset))",
      transform: "translate(-50%, -50%)",
    },

    // After measurement: use transform (pixel-based)
    ":not([data-ssr]) &": {
      transform:
        "translateX(calc(var(--direction) * (var(--root-width) * var(--tick-position) / 100 + var(--tick-offset)))) translateX(-50%) translateY(-50%)",
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

export { slider, sliderTick };

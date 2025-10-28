import {
  slider as vars,
  sliderThumb as thumbVars,
  sliderTick as tickVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";

const dragging = "[data-dragging]";

const slider = defineSlotRecipe({
  name: "slider",
  slots: ["root", "track", "control", "range", "thumb", "tick"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      width: "100%",

      gap: vars.base.enabled.root.gap,

      // touchAction: "none",
    },
    control: {
      position: "relative",

      width: "100%",
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

      left: "var(--range-start)",
      right: "var(--range-end)",

      transition: `left ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}, right ${vars.base.enabled.range.widthDuration} ${vars.base.enabled.range.widthTimingFunction}`,

      [pseudo(dragging)]: {
        transition: "none",
      },
    },
    thumb: {
      position: "absolute",
      top: "50%",
      left: "var(--thumb-start)",
      right: "var(--thumb-end)",

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
    left: "var(--tick-start)",
    right: "var(--tick-end)",

    transform: "translate(-50%, -50%)",
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

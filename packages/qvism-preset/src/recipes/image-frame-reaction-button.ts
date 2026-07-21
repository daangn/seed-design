import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { active, focus, focusVisible, pseudo } from "../utils/pseudo";
import { createPressScaleStyles } from "../utils/press-scale";
import { imageFrameReactionButton as reactionButtonVars } from "../vars/component";
import { vars as tokens } from "../vars";

export default defineSlotRecipe({
  name: "image-frame-reaction-button",
  slots: ["root", "fillIcon", "lineIcon"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "none",
      padding: 0,
      position: "relative",

      width: reactionButtonVars.base.enabled.root.size,
      height: reactionButtonVars.base.enabled.root.size,

      background: "transparent",

      ...createPressScaleStyles({ gate: pseudo(active) }),

      transition: `scale ${reactionButtonVars.base.enabled.root.scaleDuration} ${reactionButtonVars.base.enabled.root.scaleTimingFunction}`,

      "&::before": {
        content: "''",
        position: "absolute",
        inset: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&:before": {
          borderRadius: tokens.$radius.r1,
          ...createFocusRingStyles({ position: "inside" }),
        },
      },
    },
    fillIcon: {
      position: "absolute",
      inset: 0,
      margin: "auto",
      width: reactionButtonVars.base.enabled.fillIcon.size,
      height: reactionButtonVars.base.enabled.fillIcon.size,
      pointerEvents: "none",
    },
    lineIcon: {
      position: "absolute",
      inset: 0,
      margin: "auto",
      width: reactionButtonVars.base.enabled.lineIcon.size,
      height: reactionButtonVars.base.enabled.lineIcon.size,
      color: reactionButtonVars.base.enabled.lineIcon.color,
      pointerEvents: "none",

      // reactionButtonVars.base.enabled.fillIcon.shadow but without the unsupported spread value
      // NOTE: the blur value of filter: drop-shadow() is -2x blurrier than box-shadow's same value so halve the value to match of the original design
      filter: "drop-shadow(0px 2px 2px #00000026)",
    },
  },
  variants: {},
  defaultVariants: {},
});

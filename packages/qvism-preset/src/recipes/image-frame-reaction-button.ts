import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { focus, focusVisible, pressed, pseudo } from "../utils/pseudo";
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

      "&::before": {
        content: "''",
        position: "absolute",
        top: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
        right: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
        bottom: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
        left: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
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

      [pseudo(pressed)]: {
        color: reactionButtonVars.base.selected.lineIcon.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

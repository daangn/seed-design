import { defineRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { pressed, pseudo } from "../utils/pseudo";
import { imageFrameReactionButton as reactionButtonVars } from "../vars/component";

export default defineRecipe({
  name: "image-frame-reaction-button",
  base: {
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

    ...onlyIcon({
      size: reactionButtonVars.base.enabled.fillIcon.size,
      color: reactionButtonVars.base.enabled.lineIcon.color,
    }),

    "&::before": {
      content: "''",
      position: "absolute",
      top: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
      right: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
      bottom: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
      left: `calc((${reactionButtonVars.base.enabled.root.targetSize} - ${reactionButtonVars.base.enabled.root.size}) / 2 * -1)`,
    },

    "&:focus": {
      outline: "none",
    },

    [pseudo(pressed)]: {
      ...onlyIcon({
        color: reactionButtonVars.base.selected.lineIcon.color,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

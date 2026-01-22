import { defineRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { pressed, pseudo } from "../utils/pseudo";
import * as fg from "../vars/color/fg";
import {
  imageFrameIndicator as indicatorVars,
  imageFrameReactionButton as reactionButtonVars,
} from "../vars/component";

export const imageFrameIndicator = defineRecipe({
  name: "image-frame-indicator",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",

    backgroundColor: indicatorVars.base.enabled.root.color,
    color: indicatorVars.base.enabled.label.color,
    borderRadius: indicatorVars.base.enabled.root.cornerRadius,

    paddingLeft: indicatorVars.base.enabled.root.paddingX,
    paddingRight: indicatorVars.base.enabled.root.paddingX,
    paddingTop: indicatorVars.base.enabled.root.paddingY,
    paddingBottom: indicatorVars.base.enabled.root.paddingY,

    fontSize: indicatorVars.base.enabled.label.fontSize,
    lineHeight: indicatorVars.base.enabled.label.lineHeight,
    fontWeight: indicatorVars.base.enabled.label.fontWeight,
  },
  variants: {},
  defaultVariants: {},
});

export const imageFrameIcon = defineRecipe({
  name: "image-frame-icon",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    color: fg.neutralInverted,
  },
  variants: {},
  defaultVariants: {},
});

export const imageFrameReactionButton = defineRecipe({
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
      size: reactionButtonVars.base.enabled.icon.size,
      color: reactionButtonVars.base.enabled.icon.color,
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
        color: reactionButtonVars.base.selected.icon.color,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

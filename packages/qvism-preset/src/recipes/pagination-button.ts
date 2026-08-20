import { paginationButton as vars } from "../vars/component";

import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { defineRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, disabled, engaged, focusVisible, not, pseudo } from "../utils/pseudo";

const paginationButton = defineRecipe({
  name: "pagination-button",
  base: {
    display: "inline-flex",
    position: "relative",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    padding: 0,
    textTransform: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",
    flexShrink: 0,
    fontFamily: "inherit",

    width: vars.base.enabled.root.size,
    height: vars.base.enabled.root.size,
    borderRadius: vars.base.enabled.root.cornerRadius,
    background: vars.base.enabled.root.color,

    ...onlyIcon({
      color: vars.base.enabled.icon.color,
      size: vars.base.enabled.icon.size,
    }),

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),

    scale: "1",

    [pseudo(engaged, not(disabled))]: {
      background: vars.base.pressed.root.color,
    },
    [pseudo(not(disabled), active)]: {
      scale: vars.base.pressed.root.scale,
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
      background: vars.base.disabled.root.color,
      ...onlyIcon({
        color: vars.base.disabled.icon.color,
      }),
    },

    transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, scale ${vars.base.enabled.root.scaleDuration} ${vars.base.enabled.root.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,
  },
  variants: {},
  defaultVariants: {},
});

export default paginationButton;

import { paginationPageItem as vars } from "../vars/component";

import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { defineRecipe } from "../utils/define";
import { active, disabled, engaged, focusVisible, not, pseudo, selected } from "../utils/pseudo";

const paginationPageItem = defineRecipe({
  name: "pagination-page-item",
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
    color: vars.base.enabled.label.color,
    fontSize: vars.base.enabled.label.fontSize,
    lineHeight: vars.base.enabled.label.lineHeight,
    fontWeight: vars.base.enabled.label.fontWeight,

    "& > [data-pagination-page-item-label]": {
      display: "block",
      minWidth: 0,
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),

    scale: "1",

    [pseudo(engaged, not(disabled))]: {
      background: vars.base.pressed.root.color,
    },
    [pseudo(not(disabled), active)]: {
      scale: vars.base.pressed.root.scale,
    },
    [pseudo(selected)]: {
      background: vars.base.selected.root.color,
      color: vars.base.selected.label.color,
    },
    [pseudo(selected, engaged, not(disabled))]: {
      background: vars.base.selectedPressed.root.color,
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
      background: vars.base.disabled.root.color,
      color: vars.base.disabled.label.color,
    },
    [pseudo(selected, disabled)]: {
      background: vars.base.selectedDisabled.root.color,
      color: vars.base.selectedDisabled.label.color,
    },

    transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, scale ${vars.base.enabled.root.scaleDuration} ${vars.base.enabled.root.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,
  },
  variants: {},
  defaultVariants: {},
});

export default paginationPageItem;

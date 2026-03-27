import { vars as tokens } from "../vars";
import { defineSlotRecipe } from "../utils/define";
import { disabled, focusVisible, not, open, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { enterAnimation, exitAnimation } from "../utils/animation";

const highlighted = "[data-highlighted]";

const menu = defineSlotRecipe({
  name: "menu",
  slots: ["positioner", "content", "group", "groupHeader", "item", "itemLabel", "divider"],
  base: {
    positioner: {
      "--popover-z-index": "99",
      zIndex: "calc(var(--popover-z-index) + var(--z-index-offset, 0))",
      outline: "none",
    },
    content: {
      boxSizing: "border-box",
      paddingBlock: "4px",
      borderRadius: tokens.$radius.r3,
      background: tokens.$color.bg.layerFloating,
      boxShadow: "var(--seed-shadow-s2)",
      transformOrigin: "var(--transform-origin)",

      maxHeight: "480px",
      overflowY: "auto",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: "0.95",
          opacity: "0",
          duration: tokens.$duration.d2,
          timingFunction: tokens.$timingFunction.enter,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: "0.95",
          opacity: "0",
          duration: tokens.$duration.d1,
          timingFunction: tokens.$timingFunction.exit,
        }),
      },
    },
    group: {},
    groupHeader: {
      paddingBlock: "6px",
      paddingLeft: "14px",
      paddingRight: "14px",
      fontSize: tokens.$fontSize.t2,
      lineHeight: tokens.$lineHeight.t2,
      fontWeight: tokens.$fontWeight.regular,
      color: tokens.$color.fg.neutralSubtle,
      cursor: "default",
      userSelect: "none",
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "8px",

      paddingBlock: "8px",
      paddingLeft: "14px",
      paddingRight: "14px",
      minHeight: "36px",

      fontSize: tokens.$fontSize.t4,
      lineHeight: tokens.$lineHeight.t4,

      outline: "none",
      cursor: "default",
      userSelect: "none",
      border: "none",
      fontFamily: "inherit",
      margin: 0,
      boxSizing: "border-box",
      width: "100%",
      textAlign: "start",

      color: tokens.$color.fg.neutral,
      backgroundColor: "transparent",

      [pseudo(highlighted)]: {
        backgroundColor: tokens.$color.bg.neutralWeakAlpha,
      },

      [pseudo(disabled)]: {
        color: tokens.$color.fg.disabled,
        cursor: "not-allowed",
      },

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
    },
    itemLabel: {
      flex: 1,
    },
    divider: {
      marginBlock: "4px",
      marginInline: "14px",
      height: "1px",
      backgroundColor: tokens.$color.stroke.neutralMuted,
      border: "none",
    },
  },
  variants: {
    size: {
      small: {
        content: {
          width: "200px",
        },
      },
      medium: {
        content: {
          width: "260px",
        },
      },
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export default menu;

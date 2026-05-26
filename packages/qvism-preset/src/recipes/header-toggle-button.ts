import { vars } from "../vars";
import { defineRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, pressed, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const headerToggleButton = defineRecipe({
  name: "header-toggle-button",
  base: {
    display: "inline-flex",
    position: "relative",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    textTransform: "none",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",
    flexShrink: 0,
    fontFamily: "inherit",

    minHeight: "40px",
    paddingLeft: vars.$dimension.x3,
    paddingRight: vars.$dimension.x3,
    paddingTop: vars.$dimension.x2,
    paddingBottom: vars.$dimension.x2,
    borderRadius: vars.$radius.r2,
    gap: vars.$dimension.x1_5,

    background: "transparent",
    color: vars.$color.fg.neutralMuted,
    fontWeight: vars.$fontWeight.medium,

    ...suffixIcon({
      color: vars.$color.fg.neutralMuted,
    }),

    ...createFocusRingRestStyles(),
    [pseudo(focusVisible)]: createFocusRingStyles(),

    [pseudo(engaged)]: {
      background: vars.$color.bg.transparentPressed,
    },
    [pseudo(pressed)]: {
      fontWeight: vars.$fontWeight.bold,
      color: vars.$color.fg.neutral,
    },
    [pseudo(pressed, engaged)]: {
      background: vars.$color.bg.transparentPressed,
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
      color: vars.$color.fg.disabled,

      ...suffixIcon({
        color: vars.$color.fg.disabled,
      }),
    },
    [pseudo(pressed, disabled)]: {
      color: vars.$color.fg.disabled,
    },

    transition: `background-color ${vars.$duration.colorTransition}, ${FOCUS_RING_TRANSITION}`,
  },
  variants: {
    size: {
      medium: {
        fontSize: vars.$fontSize.t5,
        lineHeight: vars.$lineHeight.t5,
        ...suffixIcon({ size: "14px" }),
      },
      small: {
        fontSize: vars.$fontSize.t4,
        lineHeight: vars.$lineHeight.t4,
        ...suffixIcon({ size: "12px" }),
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default headerToggleButton;

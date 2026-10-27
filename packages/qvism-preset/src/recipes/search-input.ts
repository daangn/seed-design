import { searchInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focusVisible, active, disabled, not } from "../utils/pseudo";
import { createScaleFeedbackStyles, FEEDBACK_SCALE_TRANSITION } from "../utils/scale-feedback";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { vars as tokens } from "../vars";

const searchInput = defineSlotRecipe({
  name: "search-input",
  slots: ["root", "value", "clearButton"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      width: "100%",
      height: vars.base.enabled.root.height,
      paddingLeft: vars.base.enabled.root.paddingLeft,
      paddingRight: vars.base.enabled.root.paddingRight,
      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,
    },
    value: {
      boxSizing: "border-box",
      font: "inherit",

      appearance: "none",
      background: "none",
      border: "none",
      outline: "none",
      padding: 0,
      flexGrow: 1,
      alignSelf: "stretch",
      // browser sets the default width of inputs based on the 'size' prop of the input (e.g. <input size="20" />)
      // this sets the width to 0 to prevent any overflow and fill the available space of the parent flex container
      width: 0,

      color: vars.base.enabled.value.color,
      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,
      fontWeight: vars.base.enabled.value.fontWeight,

      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
        fontSize: vars.base.enabled.placeholder.fontSize,
        lineHeight: vars.base.enabled.placeholder.lineHeight,
        fontWeight: vars.base.enabled.placeholder.fontWeight,
      },

      // `type="search"` adds browser decorations; `ClearButton` replaces the native cancel button.
      [pseudo("::-webkit-search-cancel-button")]: {
        display: "none",
      },
      [pseudo("::-webkit-search-decoration")]: {
        appearance: "none",
      },
    },
    clearButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",

      border: "none",
      backgroundColor: "transparent",
      paddingInline: vars.base.enabled.clearButton.paddingX,
      paddingBlock: vars.base.enabled.clearButton.paddingY,

      borderRadius: tokens.$radius.full,

      [pseudo(not(disabled), active)]: createScaleFeedbackStyles(),

      transition: `${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      ...onlyIcon({
        color: vars.base.enabled.clearButtonIcon.color,
        size: vars.base.enabled.clearButtonIcon.size,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default searchInput;

import { helpBubble as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { hidden, not, pseudo, open, focusVisible } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";
import { enterAnimation, exitAnimation } from "../utils/animation";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const helpBubble = defineSlotRecipe({
  name: "help-bubble",
  slots: [
    "positioner",
    "content",
    "arrow",
    "arrowTip",
    "body",
    "title",
    "description",
    "closeButton",
  ],
  base: {
    positioner: {
      "--popover-z-index": "99",
      zIndex: "calc(var(--popover-z-index) + var(--z-index-offset, 0))",

      maxWidth: "var(--seed-popover-available-width, none)",
    },
    content: {
      display: "flex",
      alignItems: "flex-start",

      background: vars.base.rest.root.color,

      paddingInline: vars.base.rest.root.paddingX,
      paddingBlock: vars.base.rest.root.paddingY,
      borderRadius: vars.base.rest.root.cornerRadius,

      // real value, not `initial` — see https://webkit.org/b/241433
      "--seed-box-max-width--responsive": "none",
      maxWidth: "var(--seed-box-max-width)",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: vars.base.rest.root.enterScale,
          opacity: vars.base.rest.root.enterOpacity,
          duration: vars.base.rest.root.enterDuration,
          timingFunction: vars.base.rest.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: vars.base.rest.root.exitScale,
          opacity: vars.base.rest.root.exitOpacity,
          duration: vars.base.rest.root.exitDuration,
          timingFunction: vars.base.rest.root.exitTimingFunction,
        }),
      },

      // Skip the enter/exit animation while a `TooltipDelayGroup` is switching
      // between tooltips, so the swap reads as instant.
      [pseudo("[data-instant]")]: {
        animationDuration: "0s",
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },
    },
    arrow: {
      width: vars.base.rest.arrow.width,
      // we're making it square
      height: vars.base.rest.arrow.width,
    },
    arrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.rest.arrow.color,

      width: vars.base.rest.arrow.width,
      height: vars.base.rest.arrow.height,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.rest.body.gap,

      wordBreak: "keep-all",
      overflowWrap: "break-word",
      // As a flex item the body won't shrink below its content's min-content width,
      // so a long unbreakable run overflows the size()-constrained bubble. min-width: 0
      // releases that floor so overflow-wrap can break the run to keep it in view.
      minWidth: 0,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      fontWeight: vars.base.rest.title.fontWeight,
      lineHeight: vars.base.rest.title.lineHeight,

      whiteSpace: "pre-wrap",
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      fontWeight: vars.base.rest.description.fontWeight,
      lineHeight: vars.base.rest.description.lineHeight,

      whiteSpace: "pre-wrap",
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: `calc((${vars.base.rest.closeButton.targetSize} - ${vars.base.rest.closeButton.size}) / 2)`,

      marginLeft: `calc(${vars.base.rest.root.gap} - ((${vars.base.rest.closeButton.targetSize} - ${vars.base.rest.closeButton.size}) / 2))`,
      marginRight: `calc(-1 * ((${vars.base.rest.closeButton.targetSize} - ${vars.base.rest.closeButton.size}) / 2))`,
      marginBlock: `calc(-1 * ((${vars.base.rest.closeButton.targetSize} - ${vars.base.rest.closeButton.size}) / 2) + ${vars.base.rest.closeButton.marginTop})`,

      color: vars.base.rest.closeButton.color,

      ...onlyIcon({
        color: vars.base.rest.closeButton.color,
        size: vars.base.rest.closeButton.size,
      }),

      borderRadius: vars.base.rest.root.cornerRadius,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default helpBubble;

import { helpBubble as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { hidden, not, pseudo, open } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";
import { enterAnimation, exitAnimation } from "../utils/animation";

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
    },
    content: {
      display: "flex",
      alignItems: "flex-start",

      background: vars.base.enabled.root.color,

      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
      borderRadius: vars.base.enabled.root.cornerRadius,

      "--seed-box-max-width": "initial",
      maxWidth: "var(--seed-box-max-width)",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: vars.base.enabled.root.enterScale,
          opacity: vars.base.enabled.root.enterOpacity,
          duration: vars.base.enabled.root.enterDuration,
          timingFunction: vars.base.enabled.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: vars.base.enabled.root.exitScale,
          opacity: vars.base.enabled.root.exitOpacity,
          duration: vars.base.enabled.root.exitDuration,
          timingFunction: vars.base.enabled.root.exitTimingFunction,
        }),
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },
    },
    arrow: {
      width: vars.base.enabled.arrow.width,
      // we're making it square
      height: vars.base.enabled.arrow.width,
    },
    arrowTip: {
      // svg has default display of inline, which makes it be affected by line-height
      display: "block",

      fill: vars.base.enabled.arrow.color,

      width: vars.base.enabled.arrow.width,
      height: vars.base.enabled.arrow.height,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.enabled.body.gap,

      wordBreak: "keep-all",
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,
      lineHeight: vars.base.enabled.title.lineHeight,

      whiteSpace: "pre-wrap",
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,
      lineHeight: vars.base.enabled.description.lineHeight,

      whiteSpace: "pre-wrap",
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: `calc((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2)`,

      marginLeft: `calc(${vars.base.enabled.root.gap} - ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2))`,
      marginRight: `calc(-1 * ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2))`,
      marginTop: `calc(-1 * ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2) + ${vars.base.enabled.closeButton.marginTop})`,

      color: vars.base.enabled.closeButton.color,

      ...onlyIcon({
        color: vars.base.enabled.closeButton.color,
        size: vars.base.enabled.closeButton.size,
      }),
    },
  },
  variants: {},
  defaultVariants: {},
});

export default helpBubble;

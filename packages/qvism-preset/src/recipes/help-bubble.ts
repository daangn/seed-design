import { helpBubble as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { hidden, not, pseudo, open } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";
import { enterAnimation, exitAnimation } from "../utils/animation";

const helpBubble = defineSlotRecipe({
  name: "help-bubble",
  slots: ["positioner", "content", "arrow", "title", "description", "closeButton"],
  base: {
    content: {
      display: "flex",
      flexDirection: "column",
      background: vars.base.enabled.root.color,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: vars.base.enabled.root.shadow,
      wordBreak: "keep-all",

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
      fill: vars.base.enabled.arrow.color,
      width: vars.base.enabled.arrow.width,
      height: vars.base.enabled.arrow.height,

      /**
       * Prevent the arrow position from being calculated differently due to the font-size of the parent element
       */
      fontSize: "0",
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,
      lineHeight: vars.base.enabled.title.lineHeight,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      top: `calc(${vars.base.enabled.closeButton.fromTop} - ${vars.base.enabled.closeButton.targetSize} / 2 + ${vars.base.enabled.closeButton.size} / 2)`,
      right: `calc(${vars.base.enabled.closeButton.fromRight} - ${vars.base.enabled.closeButton.targetSize} / 2 + ${vars.base.enabled.closeButton.size} / 2)`,
      color: vars.base.enabled.closeButton.color,
      width: vars.base.enabled.closeButton.targetSize,
      height: vars.base.enabled.closeButton.targetSize,

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

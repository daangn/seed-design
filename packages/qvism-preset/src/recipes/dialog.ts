import { dialog as vars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { not, open, pseudo } from "../utils/pseudo";

const dialog = defineSlotRecipe({
  name: "dialog",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "header",
    "footer",
    "action",
    "title",
    "description",
  ],
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overscrollBehaviorY: "none",

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      maxWidth: vars.base.enabled.content.maxWidth,
      margin: `auto ${vars.base.enabled.content.marginX}`,
      borderRadius: vars.base.enabled.content.cornerRadius,
    },
    header: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.enabled.header.paddingX,
      paddingRight: vars.base.enabled.header.paddingX,
      paddingTop: vars.base.enabled.header.paddingTop,
      gap: vars.base.enabled.header.gap,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,
      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
  },
  variants: {
    skipAnimation: {
      false: {
        backdrop: {
          [pseudo(open)]: enterAnimation({
            timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
            duration: vars.base.enabled.backdrop.enterDuration,
            opacity: vars.base.enabled.backdrop.enterOpacity,
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.enabled.backdrop.exitTimingFunction,
            duration: vars.base.enabled.backdrop.exitDuration,
            opacity: vars.base.enabled.backdrop.exitOpacity,
          }),
        },
        content: {
          [pseudo(open)]: enterAnimation({
            timingFunction: vars.base.enabled.content.enterTimingFunction,
            duration: vars.base.enabled.content.enterDuration,
            opacity: vars.base.enabled.content.enterOpacity,
            scale: vars.base.enabled.content.enterScale,
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.enabled.content.exitTimingFunction,
            duration: vars.base.enabled.content.exitDuration,
            opacity: vars.base.enabled.content.exitOpacity,
          }),
        },
      },
    },
  },
  defaultVariants: {
    skipAnimation: false,
  },
});

export default dialog;

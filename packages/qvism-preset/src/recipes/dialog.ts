import { dialog as vars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineRecipe } from "../utils/define";
import { not, open, pseudo } from "../utils/pseudo";

const dialog = defineRecipe({
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
      inset: 0,
      overscrollBehaviorY: "none",

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

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
      padding: `${vars.base.enabled.content.paddingY} ${vars.base.enabled.content.paddingX}`,
      borderRadius: vars.base.enabled.content.cornerRadius,

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
    header: {
      display: "flex",
      flexDirection: "column",

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

      paddingTop: vars.base.enabled.footer.paddingTop,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default dialog;

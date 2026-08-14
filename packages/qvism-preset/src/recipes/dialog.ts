// NOTE: dialog naming is mid-rename; rootage/vars already use the new names, recipes and react components still use the old ones.
// Semantically (= snippet naming), this recipe is the AlertDialog:
//   snippet AlertDialog → react Dialog        → recipe "dialog"         → vars alertDialog
//   snippet Dialog      → react ContentDialog → recipe "content-dialog" → vars dialog

import { alertDialog as vars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { not, open, pseudo, focus } from "../utils/pseudo";

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
      inset: 0,
      overscrollBehaviorY: "none",

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.rest.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      // The role="dialog" container receives focus on open (a programmatic focus
      // target, not interactive), so it must never render a focus ring.
      outline: "none",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      background: vars.base.rest.content.color,
      maxWidth: vars.base.rest.content.maxWidth,
      margin: `auto ${vars.base.rest.content.marginX}`,
      borderRadius: vars.base.rest.content.cornerRadius,

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    header: {
      display: "flex",
      flexDirection: "column",

      paddingInline: vars.base.rest.header.paddingX,
      paddingTop: vars.base.rest.header.paddingTop,
      gap: vars.base.rest.header.gap,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      paddingInline: vars.base.rest.footer.paddingX,
      paddingTop: vars.base.rest.footer.paddingTop,
      paddingBottom: vars.base.rest.footer.paddingBottom,
    },
  },
  variants: {
    skipAnimation: {
      false: {
        backdrop: {
          [pseudo(open)]: enterAnimation({
            timingFunction: vars.base.rest.backdrop.enterTimingFunction,
            duration: vars.base.rest.backdrop.enterDuration,
            opacity: vars.base.rest.backdrop.enterOpacity,
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.rest.backdrop.exitTimingFunction,
            duration: vars.base.rest.backdrop.exitDuration,
            opacity: vars.base.rest.backdrop.exitOpacity,
          }),
        },
        content: {
          [pseudo(open)]: enterAnimation({
            timingFunction: vars.base.rest.content.enterTimingFunction,
            duration: vars.base.rest.content.enterDuration,
            opacity: vars.base.rest.content.enterOpacity,
            scale: vars.base.rest.content.enterScale,
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.rest.content.exitTimingFunction,
            duration: vars.base.rest.content.exitDuration,
            opacity: vars.base.rest.content.exitOpacity,
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

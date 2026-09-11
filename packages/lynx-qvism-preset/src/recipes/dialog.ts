import { defineSlotRecipe } from "../utils/define";
import { alertDialog as vars } from "../vars/component";

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

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: vars.base.enabled.backdrop.exitOpacity,
      backgroundColor: vars.base.enabled.backdrop.color,
      transitionProperty: "opacity",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      "&.ui-open": {
        opacity: 1,
        transitionDuration: vars.base.enabled.backdrop.enterDuration,
        transitionTimingFunction: vars.base.enabled.backdrop.enterTimingFunction,
      },
      "&.ui-closed": {
        opacity: vars.base.enabled.backdrop.exitOpacity,
        transitionDuration: vars.base.enabled.backdrop.exitDuration,
        transitionTimingFunction: vars.base.enabled.backdrop.exitTimingFunction,
      },
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      opacity: vars.base.enabled.content.exitOpacity,
      transform: `scale(${vars.base.enabled.content.enterScale})`,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      backgroundColor: vars.base.enabled.content.color,
      maxWidth: vars.base.enabled.content.maxWidth,
      marginTop: vars.base.enabled.content.marginY,
      marginRight: vars.base.enabled.content.marginX,
      marginBottom: vars.base.enabled.content.marginY,
      marginLeft: vars.base.enabled.content.marginX,
      borderRadius: vars.base.enabled.content.cornerRadius,
      transitionProperty: "opacity, transform",

      "&.ui-open": {
        opacity: 1,
        transform: "scale(1)",
        transitionDuration: vars.base.enabled.content.enterDuration,
        transitionTimingFunction: vars.base.enabled.content.enterTimingFunction,
      },
      "&.ui-entering": {
        animation: `seed-enter ${vars.base.enabled.content.enterDuration} ${vars.base.enabled.content.enterTimingFunction} forwards`,
        "--seed-enter-opacity": vars.base.enabled.content.enterOpacity,
        "--seed-enter-scale": vars.base.enabled.content.enterScale,
      },
      "&.ui-closed": {
        opacity: vars.base.enabled.content.exitOpacity,
        transform: `scale(${vars.base.enabled.content.enterScale})`,
        transitionDuration: vars.base.enabled.content.exitDuration,
        transitionTimingFunction: vars.base.enabled.content.exitTimingFunction,
      },
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.enabled.header.gap,
      paddingTop: vars.base.enabled.header.paddingTop,
      paddingLeft: vars.base.enabled.header.paddingX,
      paddingRight: vars.base.enabled.header.paddingX,
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
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: vars.base.enabled.footer.gap,
      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingRight: vars.base.enabled.footer.paddingX,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
      paddingLeft: vars.base.enabled.footer.paddingX,
    },
  },
  variants: {
    skipAnimation: {
      true: {
        backdrop: {
          "&.ui-open": { transitionDuration: "0s" },
          "&.ui-closed": { transitionDuration: "0s" },
        },
        content: {
          "&.ui-open": { transitionDuration: "0s" },
          "&.ui-entering": { animationDuration: "0s" },
          "&.ui-closed": { transitionDuration: "0s" },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    skipAnimation: false,
  },
});

export default dialog;

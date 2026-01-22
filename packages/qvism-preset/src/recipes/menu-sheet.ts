import { menuSheet as vars, menuSheetCloseButton as closeVars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { active, not, open, pseudo } from "../utils/pseudo";

const menuSheet = defineSlotRecipe({
  name: "menu-sheet",
  slots: [
    "backdrop",
    "positioner",
    "content",
    "header",
    "title",
    "description",
    "list",
    "group",
    "footer",
    "closeButton",
  ],
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overscrollBehaviorY: "none",

      "--sheet-z-index": "2",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      paddingLeft: vars.base.enabled.content.paddingX,
      paddingRight: vars.base.enabled.content.paddingX,
      paddingTop: vars.base.enabled.content.paddingY,
      paddingBottom: `calc(${vars.base.enabled.content.paddingY} + var(--seed-safe-area-bottom))`,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",

      gap: vars.base.enabled.header.gap,
      paddingBottom: vars.base.enabled.header.paddingBottom,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,

      // since title is an h2
      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      // since description is a p
      margin: 0,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      gap: vars.base.enabled.list.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      overflow: "hidden",

      borderRadius: vars.base.enabled.group.cornerRadius,
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      paddingTop: vars.base.enabled.footer.paddingTop,
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: closeVars.base.enabled.root.color,
      minHeight: closeVars.base.enabled.root.minHeight,
      paddingLeft: closeVars.base.enabled.root.paddingX,
      paddingRight: closeVars.base.enabled.root.paddingX,
      paddingTop: closeVars.base.enabled.root.paddingY,
      paddingBottom: closeVars.base.enabled.root.paddingY,
      borderRadius: closeVars.base.enabled.root.cornerRadius,

      border: "none",
      fontFamily: "inherit",
      outline: "none",

      color: closeVars.base.enabled.label.color,
      fontSize: closeVars.base.enabled.label.fontSize,
      lineHeight: closeVars.base.enabled.label.lineHeight,
      fontWeight: closeVars.base.enabled.label.fontWeight,

      [pseudo(active)]: {
        backgroundColor: closeVars.base.pressed.root.color,
      },
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
            translateY: "100%",
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.enabled.content.exitTimingFunction,
            duration: vars.base.enabled.content.exitDuration,
            translateY: "100%",
          }),
        },
      },
    },
  },
  defaultVariants: {
    skipAnimation: false,
  },
});

export default menuSheet;

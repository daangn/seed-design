import { actionSheetCloseButton as closeVars, actionSheet as vars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { active, not, open, pseudo } from "../utils/pseudo";

/**
 * @deprecated Use `menu-sheet` instead.
 */
const actionSheet = defineSlotRecipe({
  name: "action-sheet",
  slots: [
    "backdrop",
    "positioner",
    "content",
    "header",
    "title",
    "description",
    "list",
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

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.backdrop.exitTimingFunction,
        duration: vars.base.enabled.backdrop.exitDuration,
        opacity: vars.base.enabled.backdrop.exitOpacity,
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
        duration: vars.base.enabled.backdrop.enterDuration,
        opacity: vars.base.enabled.backdrop.enterOpacity,
      }),
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      overflow: "hidden",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateY: "100%",
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateY: "100%",
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",

      paddingInline: vars.base.enabled.header.paddingX,
      paddingBlock: vars.base.enabled.header.paddingY,
      gap: vars.base.enabled.header.gap,

      "&:after": {
        content: "''",
        display: "block",
        position: "absolute",
        left: vars.base.enabled.divider.marginX,
        right: vars.base.enabled.divider.marginX,
        bottom: 0,
        height: vars.base.enabled.divider.strokeWidth,
        background: vars.base.enabled.divider.strokeColor,
      },
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: closeVars.base.enabled.root.color,
      minHeight: closeVars.base.enabled.root.minHeight,
      paddingInline: closeVars.base.enabled.root.paddingX,
      paddingBlock: closeVars.base.enabled.root.paddingY,

      color: closeVars.base.enabled.label.color,
      fontSize: closeVars.base.enabled.label.fontSize,
      lineHeight: closeVars.base.enabled.label.lineHeight,
      fontWeight: closeVars.base.enabled.label.fontWeight,

      [pseudo(active)]: {
        backgroundColor: closeVars.base.pressed.root.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default actionSheet;

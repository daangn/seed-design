import {
  extendedActionSheet as vars,
  extendedActionSheetCloseButton as closeVars,
} from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { active, not, open, pseudo } from "../utils/pseudo";

/**
 * @deprecated Use `menu-sheet` instead.
 */
const extendedActionSheet = defineSlotRecipe({
  name: "extended-action-sheet",
  slots: [
    "backdrop",
    "positioner",
    "content",
    "header",
    "title",
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
      background: vars.base.rest.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.rest.backdrop.exitTimingFunction,
        duration: vars.base.rest.backdrop.exitDuration,
        opacity: vars.base.rest.backdrop.exitOpacity,
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.rest.backdrop.enterTimingFunction,
        duration: vars.base.rest.backdrop.enterDuration,
        opacity: vars.base.rest.backdrop.enterOpacity,
      }),
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.rest.content.color,
      paddingInline: vars.base.rest.content.paddingX,
      paddingBlock: vars.base.rest.content.paddingY,
      borderTopLeftRadius: vars.base.rest.content.topCornerRadius,
      borderTopRightRadius: vars.base.rest.content.topCornerRadius,

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.rest.content.exitTimingFunction,
        duration: vars.base.rest.content.exitDuration,
        translateY: "100%",
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.rest.content.enterTimingFunction,
        duration: vars.base.rest.content.enterDuration,
        translateY: "100%",
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      gap: vars.base.rest.header.gap,
      paddingBottom: vars.base.rest.header.paddingBottom,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      gap: vars.base.rest.list.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      overflow: "hidden",

      borderRadius: vars.base.rest.group.cornerRadius,
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      paddingTop: vars.base.rest.footer.paddingTop,
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: closeVars.base.rest.root.color,
      minHeight: closeVars.base.rest.root.minHeight,
      paddingInline: closeVars.base.rest.root.paddingX,
      paddingBlock: closeVars.base.rest.root.paddingY,
      borderRadius: closeVars.base.rest.root.cornerRadius,

      color: closeVars.base.rest.label.color,
      fontSize: closeVars.base.rest.label.fontSize,
      lineHeight: closeVars.base.rest.label.lineHeight,
      fontWeight: closeVars.base.rest.label.fontWeight,

      [pseudo(active)]: {
        backgroundColor: closeVars.base.pressed.root.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default extendedActionSheet;

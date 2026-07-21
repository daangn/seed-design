import { menuSheet as vars, menuSheetCloseButton as closeVars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focus, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { createPressScaleStyles } from "../utils/press-scale";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { vars as tokens } from "../vars";

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
      inset: 0,
      overscrollBehaviorY: "none",

      "--sheet-z-index": "2",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
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
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      paddingInline: vars.base.enabled.content.paddingX,

      // rootage menu sheet assumes the header has a handle and content needs proper spacing to show the handle,
      // but currently React menu sheet doesn't have a handle in the header
      paddingTop: `var(--menu-sheet-header-padding-top, ${tokens.$dimension.x4})`,

      paddingBottom: `calc(${vars.base.enabled.content.paddingBottom} + var(--seed-safe-area-bottom))`,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,

      [pseudo(focus)]: {
        outline: "none",
      },

      "&[data-drawer]": {
        // Performance and interaction
        touchAction: "none",
        willChange: "transform",

        // When wrapped by Drawer (SwipeableMenuSheet), expose header padding-top
        // so the Handle has room above the header.
        "--menu-sheet-header-padding-top": vars.base.enabled.content.paddingTop,

        // Expand Content Background
        "&::after": {
          top: "100%",
          height: "200vh",
          content: '""',
          position: "absolute",
          insetInline: 0,
          background: "inherit",
          zIndex: -1,
        },
      },
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
      paddingInline: closeVars.base.enabled.root.paddingX,
      paddingBlock: closeVars.base.enabled.root.paddingY,
      borderRadius: closeVars.base.enabled.root.cornerRadius,

      border: "none",
      fontFamily: "inherit",

      color: closeVars.base.enabled.label.color,
      fontSize: closeVars.base.enabled.label.fontSize,
      lineHeight: closeVars.base.enabled.label.lineHeight,
      fontWeight: closeVars.base.enabled.label.fontWeight,

      ...createPressScaleStyles({ gate: pseudo(active) }),

      transition: `scale ${closeVars.base.enabled.root.scaleDuration} ${closeVars.base.enabled.root.scaleTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      [pseudo(engaged)]: {
        backgroundColor: closeVars.base.pressed.root.color,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
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

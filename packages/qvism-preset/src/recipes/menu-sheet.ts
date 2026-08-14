import { menuSheet as vars, menuSheetCloseButton as closeVars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { engaged, focus, focusVisible, not, open, pseudo } from "../utils/pseudo";
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
      background: vars.base.rest.backdrop.color,
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

      background: vars.base.rest.content.color,
      paddingInline: vars.base.rest.content.paddingX,

      // rootage menu sheet assumes the header has a handle and content needs proper spacing to show the handle,
      // but currently React menu sheet doesn't have a handle in the header
      paddingTop: `var(--menu-sheet-header-padding-top, ${tokens.$dimension.x4})`,

      paddingBottom: `calc(${vars.base.rest.content.paddingBottom} + var(--seed-safe-area-bottom))`,
      borderTopLeftRadius: vars.base.rest.content.topCornerRadius,
      borderTopRightRadius: vars.base.rest.content.topCornerRadius,

      [pseudo(focus)]: {
        outline: "none",
      },

      "&[data-drawer]": {
        // Performance and interaction
        touchAction: "none",
        willChange: "transform",

        // When wrapped by Drawer (SwipeableMenuSheet), expose header padding-top
        // so the Handle has room above the header.
        "--menu-sheet-header-padding-top": vars.base.rest.content.paddingTop,

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

      gap: vars.base.rest.header.gap,
      paddingBottom: vars.base.rest.header.paddingBottom,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,

      // since title is an h2
      margin: 0,
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      // since description is a p
      margin: 0,
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

      border: "none",
      fontFamily: "inherit",

      color: closeVars.base.rest.label.color,
      fontSize: closeVars.base.rest.label.fontSize,
      lineHeight: closeVars.base.rest.label.lineHeight,
      fontWeight: closeVars.base.rest.label.fontWeight,

      transition: FOCUS_RING_TRANSITION,

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
            translateY: "100%",
          }),
          [pseudo(not(open))]: exitAnimation({
            timingFunction: vars.base.rest.content.exitTimingFunction,
            duration: vars.base.rest.content.exitDuration,
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

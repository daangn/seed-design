import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { focus, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { bottomSheetCloseButton as closeButtonVars, drawer as vars } from "../vars/component";
import { vars as tokens } from "../vars";

const drawer = defineSlotRecipe({
  name: "drawer",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeButton",
  ],
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overscrollBehaviorY: "none",

      "--drawer-z-index": "2",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",

      // Direction-based alignment
      [pseudo("[data-drawer-direction='right']")]: {
        justifyContent: "flex-end",
        flexDirection: "row",
      },
      [pseudo("[data-drawer-direction='left']")]: {
        justifyContent: "flex-start",
        flexDirection: "row",
      },
      [pseudo("[data-drawer-direction='bottom']")]: {
        justifyContent: "center",
        alignItems: "flex-end",
      },
      [pseudo("[data-drawer-direction='top']")]: {
        justifyContent: "center",
        alignItems: "flex-start",
      },
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",

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
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      touchAction: "none",
      willChange: "transform",

      [pseudo(focus)]: {
        outline: "none",
      },

      // Left/Right: full height, width from size variant or StyleProps
      [pseudo("[data-drawer-direction='left']")]: {
        height: "100vh",
        width: "var(--seed-box-width, var(--drawer-size-width))",
        borderTopRightRadius: vars.base.enabled.content.cornerRadius,
        borderBottomRightRadius: vars.base.enabled.content.cornerRadius,
      },
      [pseudo("[data-drawer-direction='right']")]: {
        height: "100vh",
        width: "var(--seed-box-width, var(--drawer-size-width))",
        borderTopLeftRadius: vars.base.enabled.content.cornerRadius,
        borderBottomLeftRadius: vars.base.enabled.content.cornerRadius,
      },

      // Top/Bottom: full width, auto height with max
      [pseudo("[data-drawer-direction='bottom']")]: {
        width: "100%",
        maxHeight: "var(--seed-box-max-height, 90vh)",
        borderTopLeftRadius: vars.base.enabled.content.cornerRadius,
        borderTopRightRadius: vars.base.enabled.content.cornerRadius,
        paddingBottom: "var(--seed-safe-area-bottom)",
      },
      [pseudo("[data-drawer-direction='top']")]: {
        width: "100%",
        maxHeight: "var(--seed-box-max-height, 90vh)",
        borderBottomLeftRadius: vars.base.enabled.content.cornerRadius,
        borderBottomRightRadius: vars.base.enabled.content.cornerRadius,
      },

      // Direction-based slide animations
      [pseudo(open, "[data-drawer-direction='right']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateX: "100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='right']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateX: "100%",
      }),
      [pseudo(open, "[data-drawer-direction='left']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateX: "-100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='left']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateX: "-100%",
      }),
      [pseudo(open, "[data-drawer-direction='bottom']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateY: "100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='bottom']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateY: "100%",
      }),
      [pseudo(open, "[data-drawer-direction='top']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateY: "-100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='top']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateY: "-100%",
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.header.gap,
      paddingTop: vars.base.enabled.header.paddingTop,
      paddingBottom: vars.base.enabled.header.paddingBottom,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
      wordBreak: "keep-all",

      paddingLeft: "var(--seed-dimension-spacing-x-global-gutter)",
      paddingRight: "var(--seed-dimension-spacing-x-global-gutter)",

      // When close button is shown, add extra right padding
      [pseudo("[data-show-close-button]")]: {
        paddingRight: "56px",
      },

      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      paddingLeft: vars.base.enabled.description.paddingX,
      paddingRight: vars.base.enabled.description.paddingX,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.enabled.body.paddingX,
      "--seed-box-height--responsive": "initial",
      "--seed-box-min-height--responsive": "initial",
      "--seed-box-max-height--responsive": "initial",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingLeft: "var(--seed-box-padding-x)",
      paddingRight: "var(--seed-box-padding-x)",
      height: "var(--seed-box-height)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,

      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",

      top: vars.base.enabled.closeButton.fromTop,
      right: vars.base.enabled.closeButton.fromRight,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,
      background: closeButtonVars.base.enabled.root.color,
      width: closeButtonVars.base.enabled.root.size,
      height: closeButtonVars.base.enabled.root.size,
      cursor: "pointer",

      ...onlyIcon({
        color: closeButtonVars.base.enabled.icon.color,
        size: closeButtonVars.base.enabled.icon.size,
      }),

      "&:after": {
        content: '""',

        position: "absolute",
        top: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        right: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        bottom: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        left: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,

        borderRadius: tokens.$radius.r1,

        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&:after": {
          ...createFocusRingStyles({ position: "inside" }),
        },
      },
    },
  },
  variants: {
    size: {
      small: {
        content: {
          "--drawer-size-width": vars.sizeSmall.enabled.content.width,
        },
      },
      medium: {
        content: {
          "--drawer-size-width": vars.sizeMedium.enabled.content.width,
        },
      },
      large: {
        content: {
          "--drawer-size-width": vars.sizeLarge.enabled.content.width,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default drawer;

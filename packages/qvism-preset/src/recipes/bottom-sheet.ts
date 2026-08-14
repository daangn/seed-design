import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { focus, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { bottomSheetCloseButton as closeButtonVars, bottomSheet as vars } from "../vars/component";
import { vars as tokens } from "../vars";

const bottomSheet = defineSlotRecipe({
  name: "bottom-sheet",
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

      /** Snap Points - Transition-based fade (JS sets inline opacity) */
      [pseudo("[data-snap-points='true']")]: {
        opacity: 0,
      },

      [pseudo(not(open), "[data-snap-points='true']", not("[data-snap-points-overlay='true']"))]: {
        opacity: 0,
      },

      [pseudo(open, "[data-snap-points-overlay='true']")]: {
        opacity: 1,
      },
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
      borderTopLeftRadius: vars.base.rest.content.topCornerRadius,
      borderTopRightRadius: vars.base.rest.content.topCornerRadius,
      paddingBottom: "var(--seed-safe-area-bottom)",

      // Performance and interaction
      touchAction: "none",
      willChange: "transform",

      // Base animation properties
      transition: `transform ${vars.base.rest.content.enterDuration} ${vars.base.rest.content.enterTimingFunction}`,

      /** Snap Points - Initial State (before animation ready) */
      [pseudo("[data-snap-points='true']")]: {
        transform: "translate3d(0, var(--initial-transform, 100%), 0)",
      },

      /** Snap Points - Delayed State */
      [pseudo("[data-delayed-snap-points='true']")]: {
        transform: "translate3d(0, var(--snap-point-height, 0), 0)",
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      /** Expand Content Background */
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
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.rest.header.gap,
      paddingTop: vars.base.rest.header.paddingTop,
      paddingBottom: vars.base.rest.header.paddingBottom,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,
      wordBreak: "keep-all",

      margin: 0,
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      paddingInline: vars.base.rest.description.paddingX,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    body: {
      display: "flex",
      flexDirection: "column",

      "--seed-box-padding-x--responsive": vars.base.rest.body.paddingX,
      // real values, not `initial` — see https://webkit.org/b/241433
      "--seed-box-height--responsive": "auto",
      "--seed-box-min-height--responsive": "auto",
      "--seed-box-max-height--responsive": "none",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingInline: "var(--seed-box-padding-x)",
      height: "var(--seed-box-height)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingInline: vars.base.rest.footer.paddingX,

      paddingTop: vars.base.rest.footer.paddingTop,
      paddingBottom: vars.base.rest.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",

      top: vars.base.rest.closeButton.fromTop,
      right: vars.base.rest.closeButton.fromRight,
      borderRadius: closeButtonVars.base.rest.root.cornerRadius,
      background: closeButtonVars.base.rest.root.color,
      width: closeButtonVars.base.rest.root.size,
      height: closeButtonVars.base.rest.root.size,
      cursor: "pointer",

      ...onlyIcon({
        color: closeButtonVars.base.rest.icon.color,
        size: closeButtonVars.base.rest.icon.size,
      }),

      "&:after": {
        content: '""',

        position: "absolute",
        inset: `calc((${closeButtonVars.base.rest.root.size} - ${closeButtonVars.base.rest.root.targetSize}) / 2)`,

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
    headerAlign: {
      left: {
        header: {
          justifyContent: "flex-start",
        },
        title: {
          paddingLeft: vars.headerAlignmentLeftCloseButtonFalse.rest.title.paddingLeft,
          paddingRight: vars.headerAlignmentLeftCloseButtonFalse.rest.title.paddingRight,
          [pseudo("[data-show-close-button]")]: {
            paddingLeft: vars.headerAlignmentLeftCloseButtonTrue.rest.title.paddingLeft,
            paddingRight: vars.headerAlignmentLeftCloseButtonTrue.rest.title.paddingRight,
          },
        },
      },
      center: {
        header: {
          justifyContent: "center",
          textAlign: "center",
        },
        title: {
          paddingLeft: vars.headerAlignmentCenterCloseButtonFalse.rest.title.paddingLeft,
          paddingRight: vars.headerAlignmentCenterCloseButtonFalse.rest.title.paddingRight,
          [pseudo("[data-show-close-button]")]: {
            paddingLeft: vars.headerAlignmentCenterCloseButtonTrue.rest.title.paddingLeft,
            paddingRight: vars.headerAlignmentCenterCloseButtonTrue.rest.title.paddingRight,
          },
        },
      },
    },
    skipAnimation: {
      false: {
        backdrop: {
          [pseudo(open, "[data-snap-points='false']", not("[data-animation-done='true']"))]: {
            animationName: "fade-in",
            animationDuration: vars.base.rest.backdrop.enterDuration,
            animationTimingFunction: vars.base.rest.backdrop.enterTimingFunction,
          },
          [pseudo(not(open), "[data-snap-points='false']")]: {
            animationName: "fade-out",
            animationDuration: vars.base.rest.backdrop.exitDuration,
            animationTimingFunction: vars.base.rest.backdrop.exitTimingFunction,
            animationFillMode: "forwards",
          },
          [pseudo(
            open,
            "[data-snap-points='true']",
            "[data-should-overlay-animate='true']",
            not("[data-animation-done='true']"),
          )]: {
            animationName: "fade-in",
            animationDuration: vars.base.rest.backdrop.enterDuration,
            animationTimingFunction: vars.base.rest.backdrop.enterTimingFunction,
          },
        },
        content: {
          animationDuration: vars.base.rest.content.enterDuration,
          animationTimingFunction: vars.base.rest.content.enterTimingFunction,
          [pseudo(open, "[data-snap-points='false']", not("[data-animation-done='true']"))]: {
            animationName: "drawer-slide-from-bottom",
            animationDuration: vars.base.rest.content.enterDuration,
            animationTimingFunction: vars.base.rest.content.enterTimingFunction,
          },
          [pseudo(not(open), "[data-snap-points='false']")]: {
            animationName: "drawer-slide-to-bottom",
            animationDuration: vars.base.rest.content.exitDuration,
            animationTimingFunction: vars.base.rest.content.exitTimingFunction,
            animationFillMode: "forwards",
          },
          [pseudo(open, "[data-delayed-snap-points='true']", not("[data-animation-done='true']"))]:
            {
              animationName: "drawer-slide-from-bottom",
              animationDuration: vars.base.rest.content.enterDuration,
              animationTimingFunction: vars.base.rest.content.enterTimingFunction,
            },
        },
      },
    },
  },
  defaultVariants: {
    headerAlign: "left",
    skipAnimation: false,
  },
});

export default bottomSheet;

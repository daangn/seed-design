import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { not, open, pseudo } from "../utils/pseudo";
import { bottomSheetCloseButton as closeButtonVars, bottomSheet as vars } from "../vars/component";

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

      background: vars.base.enabled.content.color,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,
      paddingBottom: "var(--seed-safe-area-bottom)",

      // Performance and interaction
      touchAction: "none",
      willChange: "transform",

      // Base animation properties
      transition: `transform ${vars.base.enabled.content.enterDuration} ${vars.base.enabled.content.enterTimingFunction}`,

      /** Snap Points - Initial State (before animation ready) */
      [pseudo("[data-snap-points='true']")]: {
        transform: "translate3d(0, var(--initial-transform, 100%), 0)",
      },

      /** Snap Points - Delayed State */
      [pseudo("[data-delayed-snap-points='true']")]: {
        transform: "translate3d(0, var(--snap-point-height, 0), 0)",
      },

      /** Expand Content Background */
      "&::after": {
        top: "100%",
        height: "200vh",
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        background: "inherit",
        zIndex: -1,
      },
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

      "--seed-box-padding-x": vars.base.enabled.body.paddingX,
      "--seed-box-height": "initial",
      "--seed-box-min-height": "initial",
      "--seed-box-max-height": "initial",
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
          paddingLeft: vars.headerAlignmentLeftCloseButtonFalse.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentLeftCloseButtonFalse.enabled.title.paddingRight,
          [pseudo("[data-show-close-button]")]: {
            paddingLeft: vars.headerAlignmentLeftCloseButtonTrue.enabled.title.paddingLeft,
            paddingRight: vars.headerAlignmentLeftCloseButtonTrue.enabled.title.paddingRight,
          },
        },
      },
      center: {
        header: {
          justifyContent: "center",
          textAlign: "center",
        },
        title: {
          paddingLeft: vars.headerAlignmentCenterCloseButtonFalse.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentCenterCloseButtonFalse.enabled.title.paddingRight,
          [pseudo("[data-show-close-button]")]: {
            paddingLeft: vars.headerAlignmentCenterCloseButtonTrue.enabled.title.paddingLeft,
            paddingRight: vars.headerAlignmentCenterCloseButtonTrue.enabled.title.paddingRight,
          },
        },
      },
    },
    skipAnimation: {
      false: {
        backdrop: {
          [pseudo(open, "[data-snap-points='false']", not("[data-animation-done='true']"))]: {
            animationName: "fade-in",
            animationDuration: vars.base.enabled.backdrop.enterDuration,
            animationTimingFunction: vars.base.enabled.backdrop.enterTimingFunction,
          },
          [pseudo(not(open), "[data-snap-points='false']")]: {
            animationName: "fade-out",
            animationDuration: vars.base.enabled.backdrop.exitDuration,
            animationTimingFunction: vars.base.enabled.backdrop.exitTimingFunction,
          },
          [pseudo(
            open,
            "[data-snap-points='true']",
            "[data-should-overlay-animate='true']",
            not("[data-animation-done='true']"),
          )]: {
            animationName: "fade-in",
            animationDuration: vars.base.enabled.backdrop.enterDuration,
            animationTimingFunction: vars.base.enabled.backdrop.enterTimingFunction,
          },
        },
        content: {
          animationDuration: vars.base.enabled.content.enterDuration,
          animationTimingFunction: vars.base.enabled.content.enterTimingFunction,
          [pseudo(open, "[data-snap-points='false']", not("[data-animation-done='true']"))]: {
            animationName: "drawer-slide-from-bottom",
            animationDuration: vars.base.enabled.content.enterDuration,
            animationTimingFunction: vars.base.enabled.content.enterTimingFunction,
          },
          [pseudo(not(open), "[data-snap-points='false']")]: {
            animationName: "drawer-slide-to-bottom",
            animationDuration: vars.base.enabled.content.exitDuration,
            animationTimingFunction: vars.base.enabled.content.exitTimingFunction,
          },
          [pseudo(open, "[data-delayed-snap-points='true']", not("[data-animation-done='true']"))]:
            {
              animationName: "drawer-slide-from-bottom",
              animationDuration: vars.base.enabled.content.enterDuration,
              animationTimingFunction: vars.base.enabled.content.enterTimingFunction,
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

import { snackbar as vars } from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { enterAnimation, exitAnimation } from "../utils/animation";

const MAX_Z_INDEX = 2147483647;

export const snackbarRegion = defineRecipe({
  name: "snackbar-region",
  base: {
    zIndex: MAX_Z_INDEX,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    left: "calc(env(safe-area-inset-left, 0px))",
    right: "calc(env(safe-area-inset-right, 0px))",
    bottom: "calc(env(safe-area-inset-bottom, 0px) + var(--snackbar-region-offset, 0px))",

    paddingLeft: vars.base.enabled.region.paddingX,
    paddingRight: vars.base.enabled.region.paddingX,
    paddingTop: vars.base.enabled.region.paddingY,
    paddingBottom: vars.base.enabled.region.paddingY,
    transitionProperty: "bottom",
    transitionDuration: vars.base.enabled.region.offsetDuration,
    transitionTimingFunction: vars.base.enabled.region.offsetTimingFunction,
  },
  variants: {},
  defaultVariants: {},
});

export const snackbar = defineSlotRecipe({
  name: "snackbar",
  slots: ["root", "message", "prefixIcon", "actionButton", "content"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",

      width: "100%",
      maxWidth: vars.base.enabled.root.maxWidth,

      background: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
      minHeight: vars.base.enabled.root.minHeight,

      ...enterAnimation({
        timingFunction: vars.base.enabled.root.enterTimingFunction,
        duration: vars.base.enabled.root.enterDuration,
        opacity: vars.base.enabled.root.enterOpacity,
        scale: vars.base.enabled.root.enterScale,
      }),

      "&:not([data-open])": {
        ...exitAnimation({
          timingFunction: vars.base.enabled.root.exitTimingFunction,
          duration: vars.base.enabled.root.exitDuration, // TODO: should we use --remove-delay here?
          opacity: vars.base.enabled.root.exitOpacity,
          scale: vars.base.enabled.root.exitScale,
        }),
      },
    },
    content: {
      display: "flex",
      flexGrow: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: vars.base.enabled.content.paddingX,
      paddingRight: vars.base.enabled.content.paddingX,
      gap: vars.base.enabled.content.gap,
    },
    message: {
      margin: 0,

      color: vars.base.enabled.message.color,
      fontSize: vars.base.enabled.message.fontSize,
      lineHeight: vars.base.enabled.message.lineHeight,
      fontWeight: vars.base.enabled.message.fontWeight,
    },
    prefixIcon: {
      flexShrink: 0,
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      paddingRight: vars.base.enabled.prefixIcon.paddingRight,
    },
    actionButton: {
      position: "relative",
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      backgroundColor: "unset",
      textDecoration: "none",
      outline: "none",
      flexShrink: 0,

      color: vars.base.enabled.actionButton.color,
      fontSize: vars.base.enabled.actionButton.fontSize,
      lineHeight: vars.base.enabled.actionButton.lineHeight,
      fontWeight: vars.base.enabled.actionButton.fontWeight,

      // target size
      "&:after": {
        content: "''",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: `calc(-1 * ${vars.base.enabled.actionButton.targetPaddingX})`,
        right: `calc(-1 * ${vars.base.enabled.actionButton.targetPaddingX})`,
        minHeight: vars.base.enabled.actionButton.targetMinHeight,
        background: "transparent",
      },
    },
  },
  variants: {
    variant: {
      default: {
        prefixIcon: {
          display: "none",
        },
      },
      positive: {
        prefixIcon: {
          color: vars.variantPositive.enabled.prefixIcon.color,
        },
      },
      critical: {
        prefixIcon: {
          color: vars.variantCritical.enabled.prefixIcon.color,
        },
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

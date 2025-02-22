import { snackbar as vars } from "@seed-design/css/vars/component";
import { defineRecipe } from "../utils/define";
import { enterAnimation, exitAnimation } from "../utils/animation";

const MAX_Z_INDEX = 2147483647;

export const snackbarRegion = defineRecipe({
  name: "snackbar-region",
  slots: ["root"],
  base: {
    root: {
      zIndex: MAX_Z_INDEX,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      left: "calc(env(safe-area-inset-left, 0px))",
      right: "calc(env(safe-area-inset-right, 0px))",
      bottom: "calc(env(safe-area-inset-bottom, 0px) + var(--snackbar-region-offset, 0px))",

      paddingInline: vars.base.enabled.region.paddingX,
      paddingBlock: vars.base.enabled.region.paddingY,
      transitionProperty: "bottom",
      transitionDuration: vars.base.enabled.region.offsetDuration,
      transitionTimingFunction: vars.base.enabled.region.offsetTimingFunction,
    },
  },
  variants: {},
  defaultVariants: {},
});

export const snackbar = defineRecipe({
  name: "snackbar",
  slots: ["root", "message", "prefixIcon", "actionButton"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      width: "100%",

      background: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      minHeight: vars.base.enabled.root.minHeight,
      gap: vars.base.enabled.root.gap,

      ...enterAnimation({
        timingFunction: vars.base.enabled.root.enterTimingFunction,
        duration: vars.base.enabled.root.enterDuration,
        opacity: vars.base.enabled.root.enterOpacity,
        translateY: "100%",
      }),

      "&:not([data-open])": {
        ...exitAnimation({
          timingFunction: vars.base.enabled.root.exitTimingFunction,
          duration: vars.base.enabled.root.exitDuration, // TODO: should we use --remove-delay here?
          opacity: vars.base.enabled.root.exitOpacity,
          translateY: "100%",
        }),
      },
    },
    message: {
      flexGrow: 1,
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

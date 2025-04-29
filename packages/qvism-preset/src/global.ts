import { vars } from "./vars";
import { defineGlobalCss } from "./utils/define";

export const globalCss = defineGlobalCss({
  ":root": {
    "--seed-safe-area-top": "0px",
    "--seed-safe-area-bottom": "0px",

    "@supports (left: constant(safe-area-inset-left))": {
      "--seed-safe-area-top": "constant(safe-area-inset-top)",
      "--seed-safe-area-bottom": "constant(safe-area-inset-bottom)",
    },

    "@supports (left: env(safe-area-inset-left))": {
      "--seed-safe-area-top": "env(safe-area-inset-top)",
      "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
    },
  },
  ".seed-loading-indicator": {
    position: "absolute",
    display: "inline-flex",
  },
  ".seed-icon, .seed-prefix-icon, .seed-suffix-icon": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ".seed-icon": {
    width: "var(--seed-icon-size)",
    height: "var(--seed-icon-size)",
    color: "var(--seed-icon-color, currentColor)",
  },
  ".seed-prefix-icon": {
    width: "var(--seed-prefix-icon-size)",
    height: "var(--seed-prefix-icon-size)",
    marginLeft: "var(--seed-prefix-icon-margin-left)",
    marginRight: "var(--seed-prefix-icon-margin-right)",
    marginTop: "var(--seed-prefix-icon-margin-top)",
    color: "var(--seed-prefix-icon-color, currentColor)",
  },
  ".seed-suffix-icon": {
    width: "var(--seed-suffix-icon-size)",
    height: "var(--seed-suffix-icon-size)",
    marginLeft: "var(--seed-suffix-icon-margin-left)",
    marginRight: "var(--seed-suffix-icon-margin-right)",
    marginTop: "var(--seed-suffix-icon-margin-top)",
    color: "var(--seed-suffix-icon-color, currentColor)",
  },
  ".seed-count": {
    fontSize: "var(--seed-count-font-size)",
    lineHeight: "var(--seed-count-line-height)",
    fontWeight: "var(--seed-count-font-weight)",
    color: "var(--seed-count-color)",
  },
  ".seed-block": {
    display: "block",
  },
  ".seed-flex": {
    display: "flex",
  },
  ".seed-inline-flex": {
    display: "inline-flex",
  },
  ".seed-inline-block": {
    display: "inline-block",
  },
  ".seed-none": {
    display: "none",
  },
  ".seed-absolute": {
    position: "absolute",
  },
  ".seed-relative": {
    position: "relative",
  },
  ".seed-fixed": {
    position: "fixed",
  },
  ".seed-sticky": {
    position: "sticky",
  },
  ".seed-flex-row": {
    flexDirection: "row",
  },
  ".seed-flex-column": {
    flexDirection: "column",
  },
  ".seed-flex-row-reverse": {
    flexDirection: "row-reverse",
  },
  ".seed-flex-column-reverse": {
    flexDirection: "column-reverse",
  },
  ".seed-flex-wrap": {
    flexWrap: "wrap",
  },
  ".seed-flex-wrap-reverse": {
    flexWrap: "wrap-reverse",
  },
  ".seed-justify-start": {
    justifyContent: "flex-start",
  },
  ".seed-justify-end": {
    justifyContent: "flex-end",
  },
  ".seed-justify-center": {
    justifyContent: "center",
  },
  ".seed-justify-between": {
    justifyContent: "space-between",
  },
  ".seed-justify-around": {
    justifyContent: "space-around",
  },
  ".seed-align-start": {
    alignItems: "flex-start",
  },
  ".seed-align-end": {
    alignItems: "flex-end",
  },
  ".seed-align-center": {
    alignItems: "center",
  },
  ".seed-align-stretch": {
    alignItems: "stretch",
  },
  ".seed-self-start": {
    alignSelf: "flex-start",
  },
  ".seed-self-end": {
    alignSelf: "flex-end",
  },
  ".seed-self-center": {
    alignSelf: "center",
  },
  ".seed-self-stretch": {
    alignSelf: "stretch",
  },
  ".seed-overflow-x-visible": {
    overflowX: "visible",
  },
  ".seed-overflow-x-hidden": {
    overflowX: "hidden",
  },
  ".seed-overflow-x-scroll": {
    overflowX: "scroll",
  },
  ".seed-overflow-x-auto": {
    overflowX: "auto",
  },
  ".seed-overflow-y-visible": {
    overflowY: "visible",
  },
  ".seed-overflow-y-hidden": {
    overflowY: "hidden",
  },
  ".seed-overflow-y-scroll": {
    overflowY: "scroll",
  },
  ".seed-overflow-y-auto": {
    overflowY: "auto",
  },
  ".seed-border-solid": {
    borderStyle: "solid",
  },
  ".seed-box-padding": {
    "--seed-box-padding": "0",
    padding: "var(--seed-box-padding)",
  },
  ".seed-box-padding-top": {
    "--seed-box-padding-top": "var(--seed-box-padding)",
    paddingTop: "var(--seed-box-padding-top)",
  },
  ".seed-box-padding-bottom": {
    "--seed-box-padding-bottom": "var(--seed-box-padding)",
    paddingBottom: "var(--seed-box-padding-bottom)",
  },
  ".seed-box-padding-left": {
    "--seed-box-padding-left": "var(--seed-box-padding)",
    paddingLeft: "var(--seed-box-padding-left)",
  },
  ".seed-box-padding-right": {
    "--seed-box-padding-right": "var(--seed-box-padding)",
    paddingRight: "var(--seed-box-padding-right)",
  },
  ".seed-box-radius": {
    "--seed-box-radius": "0",
    borderRadius: "var(--seed-box-radius)",
  },
  ".seed-box-radius-top-left": {
    "--seed-box-radius-top-left": "var(--seed-box-radius)",
    borderTopLeftRadius: "var(--seed-box-radius-top-left)",
  },
  ".seed-box-radius-top-right": {
    "--seed-box-radius-top-right": "var(--seed-box-radius)",
    borderTopRightRadius: "var(--seed-box-radius-top-right)",
  },
  ".seed-box-radius-bottom-left": {
    "--seed-box-radius-bottom-left": "var(--seed-box-radius)",
    borderBottomLeftRadius: "var(--seed-box-radius-bottom-left)",
  },
  ".seed-box-radius-bottom-right": {
    "--seed-box-radius-bottom-right": "var(--seed-box-radius)",
    borderBottomRightRadius: "var(--seed-box-radius-bottom-right)",
  },
  ".seed-box-border": {
    "--seed-box-border-color": "initial",
    borderColor: "var(--seed-box-border-color)",
  },
  ".seed-box-border-top": {
    "--seed-box-border-top-color": "var(--seed-box-border-color)",
    borderTopColor: "var(--seed-box-border-top-color)",
  },
  ".seed-box-border-bottom": {
    "--seed-box-border-bottom-color": "var(--seed-box-border-color)",
    borderBottomColor: "var(--seed-box-border-bottom-color)",
  },
  ".seed-box-border-left": {
    "--seed-box-border-left-color": "var(--seed-box-border-color)",
    borderLeftColor: "var(--seed-box-border-left-color)",
  },
  ".seed-box-border-right": {
    "--seed-box-border-right-color": "var(--seed-box-border-color)",
    borderRightColor: "var(--seed-box-border-right-color)",
  },
  ".seed-box-inset": {
    "--seed-box-top": "0",
    "--seed-box-right": "0",
    "--seed-box-bottom": "0",
    "--seed-box-left": "0",
    top: "var(--seed-box-top)",
    right: "var(--seed-box-right)",
    bottom: "var(--seed-box-bottom)",
    left: "var(--seed-box-left)",
  },
  ".seed-box-gap": {
    "--seed-box-gap": "initial",
    gap: "var(--seed-box-gap)",
  },
  ".seed-box-grow": {
    "--seed-box-flex-grow": "1",
    flexGrow: "var(--seed-box-flex-grow)",
  },
  ".seed-box-shrink": {
    "--seed-box-flex-shrink": "1",
    flexShrink: "var(--seed-box-flex-shrink)",
  },
  ".seed-box-height": {
    "--seed-box-height": "initial",
    height: "var(--seed-box-height)",
  },
  ".seed-box-max-height": {
    "--seed-box-max-height": "initial",
    maxHeight: "var(--seed-box-max-height)",
  },
  ".seed-box-min-height": {
    "--seed-box-min-height": "initial",
    minHeight: "var(--seed-box-min-height)",
  },
  ".seed-box-width": {
    "--seed-box-width": "initial",
    width: "var(--seed-box-width)",
  },
  ".seed-box-max-width": {
    "--seed-box-max-width": "initial",
    maxWidth: "var(--seed-box-max-width)",
  },
  ".seed-box-min-width": {
    "--seed-box-min-width": "initial",
    minWidth: "var(--seed-box-min-width)",
  },
  ".seed-box-background": {
    "--seed-box-background": "initial",
    backgroundColor: "var(--seed-box-background)",
  },
  ".seed-box-color": {
    "--seed-box-color": "initial",
    color: "var(--seed-box-color)",
  },
  ".seed-consistent-width": {
    // Consistent text width between font-weight changes
    "&:before": {
      content: "attr(data-text)",
      display: "block",
      visibility: "hidden",
      height: 0,
      fontWeight: vars.$fontWeight.regular,
    },
    "&:after": {
      content: "attr(data-text)",
      display: "block",
      visibility: "hidden",
      height: 0,
      fontWeight: vars.$fontWeight.bold,
    },
  },
});

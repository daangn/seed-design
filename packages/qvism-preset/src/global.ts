import { vars } from "./vars";
import { defineGlobalCss } from "./utils/define";
import { active, pseudo } from "./utils/pseudo";

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

    // Font scaling variables
    "--seed-font-size-multiplier": "1",
    "--seed-font-size-limit-min": "0.8",
    "--seed-font-size-limit-max": "1.5", // Android default 150%
    "--seed-line-height-limit-min": "0.8",
    "--seed-line-height-limit-max": "1.5", // Android default 150%
  },

  // iOS platform-specific overrides
  "[data-seed-platform='ios']": {
    "--seed-font-size-limit-max": "1.35", // iOS 135% limit
    "--seed-line-height-limit-max": "1.35",
  },

  "html[data-seed-platform='ios'][data-seed-font-scaling='enabled']": {
    "@supports (font: -apple-system-body)": {
      /**
       * 0.9412 is the font size multiplier for iOS
       * It converts iOS default 17px to web standard 16px
       * Individual font sizes are clamped to max 135% in the token system
       */
      "--seed-font-size-multiplier": "0.9412",
      font: "-apple-system-body",
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
    verticalAlign: "middle",
  },
  ".seed-icon": {
    width: "var(--seed-icon-size)",
    height: "var(--seed-icon-size)",
    color: "var(--seed-icon-color, currentColor)",
  },
  ".seed-prefix-icon": {
    width: "var(--seed-prefix-icon-size)",
    height: "var(--seed-prefix-icon-size)",
    color: "var(--seed-prefix-icon-color, currentColor)",

    marginLeft: "var(--seed-prefix-icon-margin-left, 0)",
    marginRight: "var(--seed-prefix-icon-margin-right, 0)",
    marginTop: "var(--seed-prefix-icon-margin-top, 0)",
    marginBottom: "var(--seed-prefix-icon-margin-bottom, 0)",

    alignSelf: "var(--seed-prefix-icon-align-self)",
    justifySelf: "var(--seed-prefix-icon-justify-self)",
  },
  ".seed-suffix-icon": {
    width: "var(--seed-suffix-icon-size)",
    height: "var(--seed-suffix-icon-size)",
    color: "var(--seed-suffix-icon-color, currentColor)",

    marginLeft: "var(--seed-suffix-icon-margin-left, 0)",
    marginRight: "var(--seed-suffix-icon-margin-right, 0)",
    marginTop: "var(--seed-suffix-icon-margin-top, 0)",
    marginBottom: "var(--seed-suffix-icon-margin-bottom, 0)",

    alignSelf: "var(--seed-suffix-icon-align-self)",
    justifySelf: "var(--seed-suffix-icon-justify-self)",
  },
  ".seed-count": {
    fontSize: "var(--seed-count-font-size)",
    lineHeight: "var(--seed-count-line-height)",
    fontWeight: "var(--seed-count-font-weight)",
    color: "var(--seed-count-color)",
  },
  ".seed-box": {
    "--seed-box-background": "initial",
    "--seed-box-color": "initial",
    background: "var(--seed-box-background)",
    color: "var(--seed-box-color)",

    "--seed-box-border-style": "solid",
    "--seed-box-border-color": "initial",
    borderStyle: "var(--seed-box-border-style)",
    borderColor: "var(--seed-box-border-color)",

    "--seed-box-border-width": "0",
    "--seed-box-border-top-width": "var(--seed-box-border-width)",
    "--seed-box-border-bottom-width": "var(--seed-box-border-width)",
    "--seed-box-border-left-width": "var(--seed-box-border-width)",
    "--seed-box-border-right-width": "var(--seed-box-border-width)",
    borderTopWidth: "var(--seed-box-border-top-width)",
    borderBottomWidth: "var(--seed-box-border-bottom-width)",
    borderLeftWidth: "var(--seed-box-border-left-width)",
    borderRightWidth: "var(--seed-box-border-right-width)",

    "--seed-box-padding": "0",
    "--seed-box-padding-y": "var(--seed-box-padding)",
    "--seed-box-padding-x": "var(--seed-box-padding)",
    "--seed-box-padding-bottom": "var(--seed-box-padding-y)",
    "--seed-box-padding-top": "var(--seed-box-padding-y)",
    "--seed-box-padding-left": "var(--seed-box-padding-x)",
    "--seed-box-padding-right": "var(--seed-box-padding-x)",
    paddingTop: "var(--seed-box-padding-top)",
    paddingBottom: "var(--seed-box-padding-bottom)",
    paddingLeft: "var(--seed-box-padding-left)",
    paddingRight: "var(--seed-box-padding-right)",

    "--seed-box-bleed-bottom": "0px",
    "--seed-box-bleed-top": "0px",
    "--seed-box-bleed-left": "0px",
    "--seed-box-bleed-right": "0px",
    marginTop: "calc(var(--seed-box-bleed-top) * -1)",
    marginBottom: "calc(var(--seed-box-bleed-bottom) * -1)",
    marginLeft: "calc(var(--seed-box-bleed-left) * -1)",
    marginRight: "calc(var(--seed-box-bleed-right) * -1)",

    "--seed-box-min-height": "initial",
    "--seed-box-max-height": "initial",
    "--seed-box-height": "initial",
    "--seed-box-min-width": "initial",
    "--seed-box-max-width": "initial",
    "--seed-box-width": "initial",
    minHeight: "var(--seed-box-min-height)",
    maxHeight: "var(--seed-box-max-height)",
    height: "var(--seed-box-height)",
    minWidth: "var(--seed-box-min-width)",
    maxWidth: "var(--seed-box-max-width)",
    width: "var(--seed-box-width)",

    "--seed-box-top": "initial",
    "--seed-box-bottom": "initial",
    "--seed-box-left": "initial",
    "--seed-box-right": "initial",
    top: "var(--seed-box-top)",
    bottom: "var(--seed-box-bottom)",
    left: "var(--seed-box-left)",
    right: "var(--seed-box-right)",

    "--seed-box-border-radius": "initial",
    "--seed-box-border-bottom-left-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-bottom-right-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-top-left-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-top-right-radius": "var(--seed-box-border-radius)",
    borderBottomLeftRadius: "var(--seed-box-border-bottom-left-radius)",
    borderBottomRightRadius: "var(--seed-box-border-bottom-right-radius)",
    borderTopLeftRadius: "var(--seed-box-border-top-left-radius)",
    borderTopRightRadius: "var(--seed-box-border-top-right-radius)",

    "--seed-box-box-shadow": "initial",
    boxShadow: "var(--seed-box-box-shadow)",

    "--seed-box-display": "block",
    "--seed-box-position": "initial",
    display: "var(--seed-box-display)",
    position: "var(--seed-box-position)",

    // NOTE: Not sure how to treat transform/translate right now, mark as unstable until we have a better solution.
    "--seed-box-unstable-transform": "initial",
    transform: "var(--seed-box-unstable-transform)",

    "--seed-box-z-index": "initial",
    zIndex: "var(--seed-box-z-index)",

    "--seed-box-overflow-x": "initial",
    "--seed-box-overflow-y": "initial",
    overflowX: "var(--seed-box-overflow-x)",
    overflowY: "var(--seed-box-overflow-y)",

    "--seed-box-flex-grow": "initial",
    "--seed-box-flex-shrink": "initial",
    flexGrow: "var(--seed-box-flex-grow)",
    flexShrink: "var(--seed-box-flex-shrink)",

    "--seed-box-flex-direction": "initial",
    "--seed-box-flex-wrap": "initial",
    "--seed-box-justify-content": "initial",
    "--seed-box-justify-self": "auto",
    "--seed-box-align-items": "stretch",
    "--seed-box-align-content": "stretch",
    "--seed-box-align-self": "auto",
    "--seed-box-gap": "initial",
    flexDirection: "var(--seed-box-flex-direction)",
    flexWrap: "var(--seed-box-flex-wrap)",
    justifyContent: "var(--seed-box-justify-content)",
    justifySelf: "var(--seed-box-justify-self)",
    alignItems: "var(--seed-box-align-items)",
    alignContent: "var(--seed-box-align-content)",
    alignSelf: "var(--seed-box-align-self)",
    gap: "var(--seed-box-gap)",

    "--seed-box-grid-column": "initial",
    gridColumn: "var(--seed-box-grid-column)",
    "--seed-box-grid-row": "initial",
    gridRow: "var(--seed-box-grid-row)",

    [pseudo(active)]: {
      "--seed-box-background--active": "var(--seed-box-background)",
      background: "var(--seed-box-background--active)",
    },
  },
  ".seed-grid": {
    display: "grid",

    "--seed-grid-columns": "initial",
    gridTemplateColumns: "var(--seed-grid-columns)",
    "--seed-grid-rows": "initial",
    gridTemplateRows: "var(--seed-grid-rows)",
    "--seed-grid-auto-flow": "initial",
    gridAutoFlow: "var(--seed-grid-auto-flow)",
    "--seed-grid-auto-columns": "initial",
    gridAutoColumns: "var(--seed-grid-auto-columns)",
    "--seed-grid-auto-rows": "initial",
    gridAutoRows: "var(--seed-grid-auto-rows)",
    "--seed-grid-justify-items": "stretch",
    justifyItems: "var(--seed-grid-justify-items)",
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

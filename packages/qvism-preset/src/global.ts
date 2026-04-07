import { vars } from "./vars";
import { defineGlobalCss } from "./utils/define";
import { active, pseudo } from "./utils/pseudo";

export const globalCss = defineGlobalCss({
  ":root": {
    "--ride-safe-area-top": "0px",
    "--ride-safe-area-bottom": "0px",

    "@supports (left: constant(safe-area-inset-left))": {
      "--ride-safe-area-top": "constant(safe-area-inset-top)",
      "--ride-safe-area-bottom": "constant(safe-area-inset-bottom)",
    },

    "@supports (left: env(safe-area-inset-left))": {
      "--ride-safe-area-top": "env(safe-area-inset-top)",
      "--ride-safe-area-bottom": "env(safe-area-inset-bottom)",
    },

    // Font scaling variables
    "--ride-font-size-multiplier": "1",
    "--ride-font-size-limit-min": "0.8",
    "--ride-font-size-limit-max": "1.5", // Android default 150%
    "--ride-line-height-limit-min": "0.8",
    "--ride-line-height-limit-max": "1.5", // Android default 150%
  },

  // iOS platform-specific overrides
  "[data-ride-platform='ios']": {
    "--ride-font-size-limit-max": "1.35", // iOS 135% limit
    "--ride-line-height-limit-max": "1.35",
  },

  "html[data-ride-platform='ios'][data-ride-font-scaling='enabled']": {
    "@supports (font: -apple-system-body)": {
      /**
       * 0.9412 is the font size multiplier for iOS
       * It converts iOS default 17px to web standard 16px
       * Individual font sizes are clamped to max 135% in the token system
       */
      "--ride-font-size-multiplier": "0.9412",
      font: "-apple-system-body",
    },
  },

  ".ride-loading-indicator": {
    position: "absolute",
    display: "inline-flex",
  },
  ".ride-icon, .ride-prefix-icon, .ride-suffix-icon": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    verticalAlign: "middle",
  },
  ".ride-icon": {
    width: "var(--ride-icon-size)",
    height: "var(--ride-icon-size)",
    color: "var(--ride-icon-color, currentColor)",
  },
  ".ride-prefix-icon": {
    width: "var(--ride-prefix-icon-size)",
    height: "var(--ride-prefix-icon-size)",
    color: "var(--ride-prefix-icon-color, currentColor)",

    marginLeft: "var(--ride-prefix-icon-margin-left, 0)",
    marginRight: "var(--ride-prefix-icon-margin-right, 0)",
    marginTop: "var(--ride-prefix-icon-margin-top, 0)",
    marginBottom: "var(--ride-prefix-icon-margin-bottom, 0)",

    alignSelf: "var(--ride-prefix-icon-align-self)",
    justifySelf: "var(--ride-prefix-icon-justify-self)",
  },
  ".ride-suffix-icon": {
    width: "var(--ride-suffix-icon-size)",
    height: "var(--ride-suffix-icon-size)",
    color: "var(--ride-suffix-icon-color, currentColor)",

    marginLeft: "var(--ride-suffix-icon-margin-left, 0)",
    marginRight: "var(--ride-suffix-icon-margin-right, 0)",
    marginTop: "var(--ride-suffix-icon-margin-top, 0)",
    marginBottom: "var(--ride-suffix-icon-margin-bottom, 0)",

    alignSelf: "var(--ride-suffix-icon-align-self)",
    justifySelf: "var(--ride-suffix-icon-justify-self)",
  },
  ".ride-count": {
    fontSize: "var(--ride-count-font-size)",
    lineHeight: "var(--ride-count-line-height)",
    fontWeight: "var(--ride-count-font-weight)",
    color: "var(--ride-count-color)",
  },
  ".ride-box": {
    "--ride-box-background": "initial",
    "--ride-box-color": "initial",
    background: "var(--ride-box-background)",
    color: "var(--ride-box-color)",

    "--ride-box-border-style": "solid",
    "--ride-box-border-color": "initial",
    borderStyle: "var(--ride-box-border-style)",
    borderColor: "var(--ride-box-border-color)",

    "--ride-box-border-width": "0",
    "--ride-box-border-top-width": "var(--ride-box-border-width)",
    "--ride-box-border-bottom-width": "var(--ride-box-border-width)",
    "--ride-box-border-left-width": "var(--ride-box-border-width)",
    "--ride-box-border-right-width": "var(--ride-box-border-width)",
    borderTopWidth: "var(--ride-box-border-top-width)",
    borderBottomWidth: "var(--ride-box-border-bottom-width)",
    borderLeftWidth: "var(--ride-box-border-left-width)",
    borderRightWidth: "var(--ride-box-border-right-width)",

    "--ride-box-padding": "0",
    "--ride-box-padding-y": "var(--ride-box-padding)",
    "--ride-box-padding-x": "var(--ride-box-padding)",
    "--ride-box-padding-bottom": "var(--ride-box-padding-y)",
    "--ride-box-padding-top": "var(--ride-box-padding-y)",
    "--ride-box-padding-left": "var(--ride-box-padding-x)",
    "--ride-box-padding-right": "var(--ride-box-padding-x)",
    paddingTop: "var(--ride-box-padding-top)",
    paddingBottom: "var(--ride-box-padding-bottom)",
    paddingLeft: "var(--ride-box-padding-left)",
    paddingRight: "var(--ride-box-padding-right)",

    "--ride-box-bleed-bottom": "0px",
    "--ride-box-bleed-top": "0px",
    "--ride-box-bleed-left": "0px",
    "--ride-box-bleed-right": "0px",
    marginTop: "calc(var(--ride-box-bleed-top) * -1)",
    marginBottom: "calc(var(--ride-box-bleed-bottom) * -1)",
    marginLeft: "calc(var(--ride-box-bleed-left) * -1)",
    marginRight: "calc(var(--ride-box-bleed-right) * -1)",

    "--ride-box-min-height": "initial",
    "--ride-box-max-height": "initial",
    "--ride-box-height": "initial",
    "--ride-box-min-width": "initial",
    "--ride-box-max-width": "initial",
    "--ride-box-width": "initial",
    minHeight: "var(--ride-box-min-height)",
    maxHeight: "var(--ride-box-max-height)",
    height: "var(--ride-box-height)",
    minWidth: "var(--ride-box-min-width)",
    maxWidth: "var(--ride-box-max-width)",
    width: "var(--ride-box-width)",

    "--ride-box-top": "initial",
    "--ride-box-bottom": "initial",
    "--ride-box-left": "initial",
    "--ride-box-right": "initial",
    top: "var(--ride-box-top)",
    bottom: "var(--ride-box-bottom)",
    left: "var(--ride-box-left)",
    right: "var(--ride-box-right)",

    "--ride-box-border-radius": "initial",
    "--ride-box-border-bottom-left-radius": "var(--ride-box-border-radius)",
    "--ride-box-border-bottom-right-radius": "var(--ride-box-border-radius)",
    "--ride-box-border-top-left-radius": "var(--ride-box-border-radius)",
    "--ride-box-border-top-right-radius": "var(--ride-box-border-radius)",
    borderBottomLeftRadius: "var(--ride-box-border-bottom-left-radius)",
    borderBottomRightRadius: "var(--ride-box-border-bottom-right-radius)",
    borderTopLeftRadius: "var(--ride-box-border-top-left-radius)",
    borderTopRightRadius: "var(--ride-box-border-top-right-radius)",

    "--ride-box-box-shadow": "initial",
    boxShadow: "var(--ride-box-box-shadow)",

    "--ride-box-display": "block",
    "--ride-box-position": "initial",
    display: "var(--ride-box-display)",
    position: "var(--ride-box-position)",

    // NOTE: Not sure how to treat transform/translate right now, mark as unstable until we have a better solution.
    "--ride-box-unstable-transform": "initial",
    transform: "var(--ride-box-unstable-transform)",

    "--ride-box-z-index": "initial",
    zIndex: "var(--ride-box-z-index)",

    "--ride-box-overflow-x": "initial",
    "--ride-box-overflow-y": "initial",
    overflowX: "var(--ride-box-overflow-x)",
    overflowY: "var(--ride-box-overflow-y)",

    "--ride-box-flex-grow": "initial",
    "--ride-box-flex-shrink": "initial",
    flexGrow: "var(--ride-box-flex-grow)",
    flexShrink: "var(--ride-box-flex-shrink)",

    "--ride-box-flex-direction": "initial",
    "--ride-box-flex-wrap": "initial",
    "--ride-box-justify-content": "initial",
    "--ride-box-justify-self": "auto",
    "--ride-box-align-items": "stretch",
    "--ride-box-align-content": "stretch",
    "--ride-box-align-self": "auto",
    "--ride-box-gap": "initial",
    flexDirection: "var(--ride-box-flex-direction)",
    flexWrap: "var(--ride-box-flex-wrap)",
    justifyContent: "var(--ride-box-justify-content)",
    justifySelf: "var(--ride-box-justify-self)",
    alignItems: "var(--ride-box-align-items)",
    alignContent: "var(--ride-box-align-content)",
    alignSelf: "var(--ride-box-align-self)",
    gap: "var(--ride-box-gap)",

    "--ride-box-grid-column": "initial",
    gridColumn: "var(--ride-box-grid-column)",
    "--ride-box-grid-row": "initial",
    gridRow: "var(--ride-box-grid-row)",

    // Only apply active background when explicitly opted in via _active prop.
    // Without [data-has-active-bg], the :active rule's higher specificity (0,2,0)
    // would override external class backgrounds (e.g. .bg-red-500) with initial (transparent) even when _active is not set.
    // this workaround can be removed when decide to support cascade layers by default
    [pseudo("[data-has-active-bg]", active)]: {
      background: "var(--ride-box-background--active)",
    },
  },
  ".ride-grid": {
    display: "grid",

    "--ride-grid-columns": "initial",
    gridTemplateColumns: "var(--ride-grid-columns)",
    "--ride-grid-rows": "initial",
    gridTemplateRows: "var(--ride-grid-rows)",
    "--ride-grid-auto-flow": "initial",
    gridAutoFlow: "var(--ride-grid-auto-flow)",
    "--ride-grid-auto-columns": "initial",
    gridAutoColumns: "var(--ride-grid-auto-columns)",
    "--ride-grid-auto-rows": "initial",
    gridAutoRows: "var(--ride-grid-auto-rows)",
    "--ride-grid-justify-items": "stretch",
    justifyItems: "var(--ride-grid-justify-items)",
  },
  ".ride-consistent-width": {
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

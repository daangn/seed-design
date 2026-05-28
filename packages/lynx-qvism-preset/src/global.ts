import { defineGlobalCss } from "./utils/define";
import { pseudo } from "./utils/pseudo";

export const globalCss = defineGlobalCss({
  // iOS platform-specific overrides
  ".seed-platform-ios": {
    "--seed-platform": "ios",
  },

  ".seed-loading-indicator": {
    position: "absolute",
    display: "flex",
  },
  ".seed-icon, .seed-prefix-icon, .seed-suffix-icon": {
    display: "flex",
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
    "--seed-box-background": "transparent",
    "--seed-box-color": "currentColor",
    background: "var(--seed-box-background)",
    color: "var(--seed-box-color)",

    "--seed-box-border-style": "solid",
    "--seed-box-border-color": "transparent",
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

    "--seed-box-min-height": "auto",
    "--seed-box-max-height": "none",
    "--seed-box-height": "auto",
    "--seed-box-min-width": "auto",
    "--seed-box-max-width": "none",
    "--seed-box-width": "auto",
    minHeight: "var(--seed-box-min-height)",
    maxHeight: "var(--seed-box-max-height)",
    height: "var(--seed-box-height)",
    minWidth: "var(--seed-box-min-width)",
    maxWidth: "var(--seed-box-max-width)",
    width: "var(--seed-box-width)",

    "--seed-box-top": "auto",
    "--seed-box-bottom": "auto",
    "--seed-box-left": "auto",
    "--seed-box-right": "auto",
    top: "var(--seed-box-top)",
    bottom: "var(--seed-box-bottom)",
    left: "var(--seed-box-left)",
    right: "var(--seed-box-right)",

    "--seed-box-border-radius": "0",
    "--seed-box-border-bottom-left-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-bottom-right-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-top-left-radius": "var(--seed-box-border-radius)",
    "--seed-box-border-top-right-radius": "var(--seed-box-border-radius)",
    borderBottomLeftRadius: "var(--seed-box-border-bottom-left-radius)",
    borderBottomRightRadius: "var(--seed-box-border-bottom-right-radius)",
    borderTopLeftRadius: "var(--seed-box-border-top-left-radius)",
    borderTopRightRadius: "var(--seed-box-border-top-right-radius)",

    "--seed-box-box-shadow": "none",
    boxShadow: "var(--seed-box-box-shadow)",

    "--seed-box-display": "block",
    "--seed-box-position": "relative",
    display: "var(--seed-box-display)",
    position: "var(--seed-box-position)",

    // NOTE: Not sure how to treat transform/translate right now, mark as unstable until we have a better solution.
    "--seed-box-unstable-transform": "none",
    transform: "var(--seed-box-unstable-transform)",

    "--seed-box-z-index": "auto",
    zIndex: "var(--seed-box-z-index)",

    "--seed-box-overflow-x": "visible",
    "--seed-box-overflow-y": "visible",
    overflowX: "var(--seed-box-overflow-x)",
    overflowY: "var(--seed-box-overflow-y)",

    "--seed-box-flex-grow": "0",
    "--seed-box-flex-shrink": "1",
    flexGrow: "var(--seed-box-flex-grow)",
    flexShrink: "var(--seed-box-flex-shrink)",

    "--seed-box-flex-direction": "row",
    "--seed-box-flex-wrap": "nowrap",
    "--seed-box-justify-content": "flex-start",
    "--seed-box-justify-self": "auto",
    "--seed-box-align-items": "stretch",
    "--seed-box-align-content": "stretch",
    "--seed-box-align-self": "auto",
    "--seed-box-gap": "0px",
    flexDirection: "var(--seed-box-flex-direction)",
    flexWrap: "var(--seed-box-flex-wrap)",
    justifyContent: "var(--seed-box-justify-content)",
    justifySelf: "var(--seed-box-justify-self)",
    alignItems: "var(--seed-box-align-items)",
    alignContent: "var(--seed-box-align-content)",
    alignSelf: "var(--seed-box-align-self)",
    gap: "var(--seed-box-gap)",

    // Only apply active background when explicitly opted in via _active prop.
    // Without [data-has-active-bg], the :active rule's higher specificity (0,2,0)
    // would override external class backgrounds with transparent even when _active is not set.
    // this workaround can be removed when decide to support cascade layers by default
    [pseudo("[data-has-active-bg]:active")]: {
      background: "var(--seed-box-background--active)",
    },
    [pseudo("[data-has-active-bg][data-active]")]: {
      background: "var(--seed-box-background--active)",
    },
  },
  ".seed-grid": {
    display: "grid",

    "--seed-grid-columns": "none",
    gridTemplateColumns: "var(--seed-grid-columns)",
    "--seed-grid-rows": "none",
    gridTemplateRows: "var(--seed-grid-rows)",
    "--seed-grid-auto-flow": "row",
    gridAutoFlow: "var(--seed-grid-auto-flow)",
    "--seed-grid-auto-columns": "auto",
    gridAutoColumns: "var(--seed-grid-auto-columns)",
    "--seed-grid-auto-rows": "auto",
    gridAutoRows: "var(--seed-grid-auto-rows)",
    "--seed-grid-justify-items": "stretch",
    justifyItems: "var(--seed-grid-justify-items)",
  },
});

import { defineGlobalCss } from "./utils/define";

export const globalCss = defineGlobalCss({
  ":root": {
    "--seed-safe-area-top": "env(safe-area-inset-top)",
    "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
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
});

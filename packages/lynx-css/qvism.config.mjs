import { postcssEngaged } from "@seed-design/postcss-engaged";
import { postcssLynxCompat } from "@seed-design/postcss-lynx-compat";
import {
  recipes,
  tokens,
  keyframes,
  globalCss,
  definePreset,
  engaged,
  hover,
  active,
} from "@seed-design/qvism-preset";

export default definePreset({
  prefix: "seed",
  postcssPlugins: [
    postcssEngaged({
      selector: engaged,
      replace: {
        hover,
        active,
      },
    }),
    postcssLynxCompat({
      selectorMappings: [
        { match: 'user-color-scheme="dark"', replace: ".seed-user-color-scheme-dark" },
        { match: 'user-color-scheme="light"', replace: ".seed-user-color-scheme-light" },
        { match: 'color-mode="dark-only"', replace: ".seed-color-mode-dark-only" },
        { match: 'color-mode="light-only"', replace: ".seed-color-mode-light-only" },
        { match: 'color-mode="system"', replace: "" },
      ],
    }),
  ],
  deriveSlots: ["root", "text"],
  extraVariants: {
    disabled: [true],
    loading: [true],
  },
  theme: {
    tokens,
    recipes,
    keyframes,
    globalCss,
  },
  targets: [],
});

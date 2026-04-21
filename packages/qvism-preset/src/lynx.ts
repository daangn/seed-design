import { postcssLynxCompat } from "@seed-design/postcss-lynx-compat";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { lynxRecipes } from "./recipes-lynx";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";

export default definePreset({
  prefix: "seed",
  postTransformPlugins: [
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
    recipes: lynxRecipes,
    keyframes,
    globalCss,
  },
});

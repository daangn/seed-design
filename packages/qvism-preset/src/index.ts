import { postcssEngaged } from "@seed-design/postcss-engaged";
import { postcssLynxCompat } from "@seed-design/postcss-lynx-compat";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { engaged, hover, active } from "./utils/pseudo";

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
  ],
  theme: {
    tokens,
    recipes,
    keyframes,
    globalCss,
  },
  targets: [
    {
      suffix: "lynx",
      outputDir: "../lynx-css",
      recipesDir: "../lynx-css/recipes",
      postcssPlugins: [
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
    },
  ],
});

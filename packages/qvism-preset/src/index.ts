import { postcssEngaged } from "@seed-design/postcss-engaged";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { engaged, hover, active } from "./utils/pseudo";

// Named exports for composing custom presets (e.g., lynx-css)
export { recipes } from "./recipes";
export { tokens } from "./tokens";
export { keyframes } from "./keyframes";
export { globalCss } from "./global";
export { definePreset } from "./utils/define";
export { postcssEngaged } from "@seed-design/postcss-engaged";
export { postcssLynxCompat } from "@seed-design/postcss-lynx-compat";
export { engaged, hover, active } from "./utils/pseudo";

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
  targets: [],
});

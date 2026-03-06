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
      postcssPlugins: [postcssLynxCompat()],
    },
  ],
});

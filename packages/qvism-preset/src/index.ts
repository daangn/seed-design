import { postcssEngaged } from "@seed-design/postcss-engaged";
import { postcssResponsive } from "@seed-design/postcss-responsive";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { engaged, hover, active } from "./utils/pseudo";

export default definePreset({
  prefix: "seed",
  postcssPlugins: [
    postcssResponsive({
      breakpoints: [
        { name: "base", minWidth: 0 },
        { name: "sm", minWidth: 480 },
        { name: "md", minWidth: 768 },
        { name: "lg", minWidth: 1280 },
        { name: "xl", minWidth: 1440 },
      ],
    }),
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
});

import { postcssEngaged } from "@seed-design/postcss-engaged";
import { postcssResponsive } from "@seed-design/postcss-responsive";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { breakpointValues } from "./utils/breakpoint";
import { engaged, hover, active } from "./utils/pseudo";

export default definePreset({
  prefix: "seed",
  postcssPlugins: [
    postcssResponsive({
      breakpoints: Object.entries(breakpointValues).map(([name, minWidth]) => ({
        name,
        minWidth,
      })),
    }),
    postcssEngaged({
      selector: engaged,
      replace: {
        hover,
        active,
      },
      media: {
        hover: "(hover: hover) and (pointer: fine)",
        active: "not all and (hover: hover) and (pointer: fine)",
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

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
  lightningcssOptions: {
    // Without `targets`, Lightning CSS emits the newest syntax it knows: `@media`
    // conditions become range syntax (dropped wholesale below Chrome 104 / Safari
    // 16.4) and fallback declaration pairs collapse to the modern half alone.
    // Versions are encoded as `major << 16 | minor << 8 | patch`.
    // The unused `--lightningcss-light`/`--lightningcss-dark` vars in the output arm the
    // `light-dark()` downlevel, so the first use of it is covered rather than shipped raw.
    targets: {
      chrome: 88 << 16,
      safari: 15 << 16,
      ios_saf: 15 << 16,
    },
  },
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

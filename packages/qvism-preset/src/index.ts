import { postcssEngaged } from "@ride-developer/postcss-engaged";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { engaged, hover, active } from "./utils/pseudo";

export default definePreset({
  prefix: "ride",
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
});

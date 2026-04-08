import { postcssEngaged } from "@seed-design/postcss-engaged";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { engaged, hover, active, media } from "./utils/pseudo";

export default definePreset({
  prefix: "seed",
  postcssPlugins: [
    postcssEngaged({
      selector: engaged,
      replace: {
        hover,
        active,
      },
      media: {
        hover: media.isHoverableInputDevice.replace("@media ", ""),
        active: media.isNotHoverableInputDevice.replace("@media ", ""),
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

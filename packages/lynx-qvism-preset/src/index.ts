import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { expandInsetPlugin } from "./utils/postcss-expand-inset";

export default definePreset({
  prefix: "seed",
  postTransformPlugins: [expandInsetPlugin],
  theme: {
    tokens,
    recipes,
    keyframes,
    globalCss,
  },
});

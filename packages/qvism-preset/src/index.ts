import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";

export default definePreset({
  theme: {
    tokens,
    recipes,
    keyframes,
    globalCss,
  },
});

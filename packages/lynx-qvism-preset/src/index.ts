import { Features } from "lightningcss";

import { globalCss } from "./global";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { tokens } from "./tokens";
import { definePreset } from "./utils/define";
import { resolveTokenReferences } from "./utils/resolve-token-references";

export default definePreset({
  prefix: "seed",
  lightningcssOptions: {
    include: Features.LogicalProperties,
  },
  theme: {
    tokens: resolveTokenReferences(tokens),
    recipes,
    keyframes,
    globalCss,
  },
});

import { typescript } from "@seed-design/rootage-core";
import type { Config } from "@seed-design/rootage-cli";

export default {
  "token-ts": { prefix: "seed" },
  "component-spec": {
    prefix: "seed",
    // Same as lynx-qvism-preset's seed-component-spec: Lynx needs font-scaled rem as sp (1rem = 16sp).
    generator: (ast, options) =>
      typescript
        .createStringifier({
          ...options,
          formatDimension: ({ value, unit }) =>
            unit === "rem" ? `${Number.parseFloat((value * 16).toFixed(4))}sp` : `${value}${unit}`,
        })
        .getComponentSpecFiles(ast.componentSpecs),
  },
} satisfies Config;

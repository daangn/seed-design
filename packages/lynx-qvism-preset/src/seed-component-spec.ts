import { typescript } from "@seed-design/rootage-core";
import type { ComponentSpecGeneratorFunction } from "@seed-design/rootage-core/generator";

import { remToSp } from "./utils/sp";

/**
 * SEED component spec generator for Lynx.
 * Rootage writes font-scaled dimensions in rem, which Lynx needs as sp.
 */
const generateSeedComponentSpec: ComponentSpecGeneratorFunction = (ast, options) =>
  typescript
    .createStringifier({
      ...options,
      formatDimension: ({ value, unit }) => (unit === "rem" ? remToSp(value) : `${value}${unit}`),
    })
    .getComponentSpecFiles(ast.componentSpecs);

export default generateSeedComponentSpec;

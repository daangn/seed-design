import type { Config } from "@seed-design/rootage-cli";

import generateSeedComponentSpec from "../lynx-qvism-preset/src/seed-component-spec";

export default {
  "token-ts": { prefix: "seed" },
  "component-spec": { prefix: "seed", generator: generateSeedComponentSpec },
} satisfies Config;

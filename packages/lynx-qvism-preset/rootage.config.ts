import type { Config } from "@seed-design/rootage-cli";

import generateSeedComponentSpec from "./src/seed-component-spec";
import generateSeedCss from "./src/seed-css";

export default {
  "token-css": { prefix: "seed", generator: generateSeedCss, ts: true },
  "token-ts": { prefix: "seed" },
  "component-spec": { prefix: "seed", generator: generateSeedComponentSpec },
} satisfies Config;

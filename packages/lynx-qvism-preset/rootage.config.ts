import type { Config } from "@seed-design/rootage-cli";

export default {
  "token-css": { prefix: "seed", generator: "./lib/seed-css.js", ts: true },
  "token-ts": { prefix: "seed" },
  "component-spec": { prefix: "seed" },
} satisfies Config;

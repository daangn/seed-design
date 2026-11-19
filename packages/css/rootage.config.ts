import type { Config } from "@seed-design/rootage-cli";

export default {
  "token-ts": { prefix: "seed" },
  "component-spec": {
    prefix: "seed",
    filter: ({ path }) => path === "components/typography.yaml",
  },
} satisfies Config;

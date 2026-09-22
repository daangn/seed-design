import type { Config } from "@seed-design/rootage-cli";

export default {
  "component-spec": {
    filter: ({ path }) => path === "components/typography.yaml",
  },
} satisfies Config;

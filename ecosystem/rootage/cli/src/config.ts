import { cosmiconfig } from "cosmiconfig";

import type { Command, getComponentSpecEntries } from "./commands";

type ComponentSpecEntryShape = ReturnType<typeof getComponentSpecEntries>[number];

// An interface rather than an alias: a config file's declaration emit can then name it
// through this package, where the alias would expand to rootage-core types it cannot reach.
export interface ComponentSpecEntry extends ComponentSpecEntryShape {}

export type Config = {
  [C in Extract<Command, "component-spec">]?: {
    filter?: (entry: ComponentSpecEntry) => boolean;
  };
};

const MODULE_NAME = "rootage";

// Limited to modules: `filter` is a function, which JSON, YAML and `package.json` cannot hold.
const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [
    `.config/${MODULE_NAME}.js`,
    `.config/${MODULE_NAME}.ts`,
    `.config/${MODULE_NAME}.mjs`,
    `.config/${MODULE_NAME}.cjs`,
    `${MODULE_NAME}.config.js`,
    `${MODULE_NAME}.config.ts`,
    `${MODULE_NAME}.config.mjs`,
    `${MODULE_NAME}.config.cjs`,
  ],
});

export async function loadConfig(configPath?: string): Promise<Config> {
  const result = configPath ? await explorer.load(configPath) : await explorer.search();
  if (!result || result.isEmpty) return {};

  console.log("Using config", result.filepath);

  return result.config;
}

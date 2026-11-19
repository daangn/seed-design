import type { GeneratorFunction } from "@seed-design/rootage-core/generator";
import { cosmiconfig } from "cosmiconfig";
import path from "node:path";

import type { Command, getComponentSpecEntries } from "./commands";

type ComponentSpecEntryShape = ReturnType<typeof getComponentSpecEntries>[number];

// An interface rather than an alias: a config file's declaration emit can then name it
// through this package, where the alias would expand to rootage-core types it cannot reach.
export interface ComponentSpecEntry extends ComponentSpecEntryShape {}

interface CommandOptionsMap {
  "token-ts": { prefix?: string };
  "component-spec": { prefix?: string; filter?: (entry: ComponentSpecEntry) => boolean };
  "token-css": {
    prefix?: string;
    /** Writes `token.css` with this function instead of the default CSS generator. */
    generator?: GeneratorFunction;
    /** Also writes `tokens.ts`, exporting the CSS as a string in `tokens._raw`. */
    ts?: boolean;
  };
  "tailwind3-plugin": { prefix?: string };
  tailwind4: { prefix?: string };
}

type Satisfies<T extends U, U> = T;

export type ConfigurableCommand = Satisfies<keyof CommandOptionsMap, Command>;

export type CommandOptions<C extends ConfigurableCommand> = CommandOptionsMap[C];

export type Config = {
  [C in ConfigurableCommand]?: CommandOptions<C>;
};

const MODULE_NAME = "rootage";

// Limited to modules: `filter` and `generator` are functions, which JSON, YAML and `package.json` cannot hold.
const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [
    `.config/${MODULE_NAME}.js`,
    `.config/${MODULE_NAME}.ts`,
    `.config/${MODULE_NAME}.mjs`,
    `.config/${MODULE_NAME}.cjs`,
    `.config/${MODULE_NAME}.mts`,
    `.config/${MODULE_NAME}.cts`,
    `${MODULE_NAME}.config.js`,
    `${MODULE_NAME}.config.ts`,
    `${MODULE_NAME}.config.mjs`,
    `${MODULE_NAME}.config.cjs`,
    `${MODULE_NAME}.config.mts`,
    `${MODULE_NAME}.config.cts`,
  ],
});

export async function loadConfig(configPath?: string, searchFrom = process.cwd()): Promise<Config> {
  const result = configPath
    ? await explorer.load(path.resolve(searchFrom, configPath))
    : await explorer.search(searchFrom);
  if (!result || result.isEmpty) return {};

  console.log("Using config", result.filepath);

  return result.config;
}

export const resolveCommandOptions = <C extends ConfigurableCommand>(
  config: Config,
  command: C,
): CommandOptions<C> => config[command] ?? {};

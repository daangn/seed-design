import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { Command, getComponentSpecEntries } from "./commands";

type ComponentSpecEntryShape = ReturnType<typeof getComponentSpecEntries>[number];

// An interface rather than an alias: a config file's declaration emit can then name it
// through this package, where the alias would expand to rootage-core types it cannot reach.
export interface ComponentSpecEntry extends ComponentSpecEntryShape {}

interface GeneratorOptions {
  /**
   * Generator module to load. A path starting with `.` resolves against the config file's
   * directory; anything else is passed to `import()` as is.
   */
  generator?: string;
}

interface CommandOptionsMap {
  "token-ts": { prefix?: string };
  "component-spec": { prefix?: string; filter?: (entry: ComponentSpecEntry) => boolean };
  "token-css": GeneratorOptions & {
    prefix?: string;
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

export interface LoadedConfig {
  config: Config;
  /** Directory that relative paths in the config resolve against. */
  baseDir: string;
}

const MODULE_NAME = "rootage";

// Limited to modules: `filter` is a function, which JSON, YAML and `package.json` cannot hold.
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

export async function loadConfig(
  configPath?: string,
  searchFrom = process.cwd(),
): Promise<LoadedConfig> {
  const result = configPath
    ? await explorer.load(path.resolve(searchFrom, configPath))
    : await explorer.search(searchFrom);
  if (!result || result.isEmpty) return { config: {}, baseDir: searchFrom };

  console.log("Using config", result.filepath);

  // A config under `.config/` describes the directory above it, as for `rootage.config.*`.
  const configDir = path.dirname(result.filepath);
  const baseDir = path.basename(configDir) === ".config" ? path.dirname(configDir) : configDir;

  return { config: result.config, baseDir };
}

export function resolveCommandOptions<C extends ConfigurableCommand>(
  { config, baseDir }: LoadedConfig,
  command: C,
): CommandOptions<C> {
  const options: CommandOptions<C> = config[command] ?? {};

  if (!("generator" in options) || typeof options.generator !== "string") return options;
  if (!options.generator.startsWith(".")) return options;

  return { ...options, generator: pathToFileURL(path.resolve(baseDir, options.generator)).href };
}

import { cosmiconfig } from "cosmiconfig";
import { loadConfig } from "tsconfig-paths";
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths";
import { z } from "zod";

const MODULE_NAME = "seed-design";

const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [`${MODULE_NAME}.json`],
});

export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths">,
) {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(importPath, undefined, () => true, [
    ".ts",
    ".tsx",
  ]);
}

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    aliases: z.object({
      components: z.string(),
      // utils: z.string(),
      // ui: z.string().optional(),
    }),
  })
  .strict();

export type RawConfig = z.infer<typeof rawConfigSchema>;

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    components: z.string(),
    // utils: z.string(),
    // ui: z.string(),
  }),
});

export async function getConfig(cwd: string) {
  const config = await getRawConfig(cwd);

  if (!config) {
    return null;
  }

  return await resolveConfigPaths(cwd, config);
}

export type Config = z.infer<typeof configSchema>;

export async function resolveConfigPaths(cwd: string, config: RawConfig) {
  // Read tsconfig.json.
  const tsConfig = loadConfig(cwd);

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load ${config.tsx ? "tsconfig" : "jsconfig"}.json. ${
        tsConfig.message ?? ""
      }`.trim(),
    );
  }

  return configSchema.parse({
    ...config,
    // NOTE: ui 옵션이 있으면 그냥 ui 폴더를 사용하고 아니면 components를 사용함
    resolvedPaths: {
      components: await resolveImport(config.aliases.components, tsConfig),
      // utils: await resolveImport(config.aliases.utils, tsConfig),
      // ui: config.aliases.ui
      //   ? await resolveImport(config.aliases.ui, tsConfig)
      //   : await resolveImport(config.aliases.components, tsConfig),
    },
  });
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  try {
    const configResult = await explorer.search(cwd);

    if (!configResult) {
      return null;
    }

    return rawConfigSchema.parse(configResult.config);
  } catch (error) {
    throw new Error(`Invalid configuration found in ${cwd}/seed-design.json.`);
  }
}

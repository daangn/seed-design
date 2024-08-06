import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { z } from "zod";

const MODULE_NAME = "seed-design";

const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [`${MODULE_NAME}.json`],
});

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    path: z.string(),
  })
  .strict();

export type RawConfig = z.infer<typeof rawConfigSchema>;

export const configSchema = rawConfigSchema.extend({
  resolvedUIPaths: z.string(),
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
  const seedComponentRootPath = path.resolve(cwd, config.path);

  return configSchema.parse({
    ...config,
    resolvedUIPaths: path.join(seedComponentRootPath, "ui"),
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

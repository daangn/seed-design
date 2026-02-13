import { z } from "zod";

/**
 * this should be in sync with `docs/registry/schema.ts`
 */
export const publicRegistryItemSchema = z.object({
  id: z.string(),

  description: z.string().optional(),

  deprecated: z.boolean().optional(),

  hideFromCLICatalog: z.boolean().optional(),

  ///////////////////////////////////////////////////////////////

  dependencies: z.array(z.string()).optional(),

  innerDependencies: z
    .array(
      z.object({
        registryId: z.string(),
        itemIds: z.array(z.string()),
      }),
    )
    .optional(),

  ///////////////////////////////////////////////////////////////

  snippets: z.array(
    z.object({
      path: z.string(),
      dependencies: z.record(z.string(), z.string()).optional(),
      content: z.string(),
    }),
  ),
});

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export const publicRegistrySchema = z.object({
  id: z.string(),

  hideFromCLICatalog: z.boolean().optional(),

  items: z.array(
    publicRegistryItemSchema
      .omit({ snippets: true })
      .extend({
        snippets: z.array(
          z.object({
            path: z.string(),
            dependencies: z.record(z.string(), z.string()).optional(),
          }),
        ),
      }),
  ),
});

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export const publicAvailableRegistriesSchema = z.array(z.object({ id: z.string() }));

export type PublicRegistryItem = z.infer<typeof publicRegistryItemSchema>;
export type PublicRegistry = z.infer<typeof publicRegistrySchema>;
export type PublicAvailableRegistries = z.infer<typeof publicAvailableRegistriesSchema>;

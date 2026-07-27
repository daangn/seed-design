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
    publicRegistryItemSchema.omit({ snippets: true }).extend({
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

///////////////////////////////////////////////////////////////

export const docsSnippetSchema = z.object({
  label: z.string(),
  path: z.string(),
});

export const docsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  docUrl: z.string(),
  deprecated: z.boolean().optional(),
  snippetKey: z.string().optional(),
  snippets: z.array(docsSnippetSchema).optional(),
});

export const docsSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  items: z.array(docsItemSchema),
});

export const docsCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  sections: z.array(docsSectionSchema),
});

export const docsIndexSchema = z.object({
  categories: z.array(docsCategorySchema),
});

export type DocsItem = z.infer<typeof docsItemSchema>;
export type DocsSection = z.infer<typeof docsSectionSchema>;
export type DocsCategory = z.infer<typeof docsCategorySchema>;
export type DocsIndex = z.infer<typeof docsIndexSchema>;

///////////////////////////////////////////////////////////////

/**
 * this should be in sync with `docs/scripts/generate-compat-manifest.ts`
 * and `docs/registry/react/compat-overlays.ts`
 */
export const compatVersionSchema = z.object({
  version: z.string(),
  publishedAt: z.string(),
  peers: z.record(z.string(), z.string()),
});

export const compatOverlaySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("backfill"),
    package: z.string(),
    versionRange: z.string(),
    peers: z.record(z.string(), z.string()),
    reason: z.string(),
  }),
  z.object({
    kind: z.literal("correction"),
    package: z.string(),
    versionRange: z.string(),
    peers: z.record(z.string(), z.string()),
    reason: z.string(),
  }),
  z.object({
    kind: z.literal("known-bad"),
    packages: z.record(z.string(), z.string()),
    reason: z.string(),
  }),
  z.object({
    kind: z.literal("breaking-boundary"),
    package: z.string(),
    version: z.string(),
    notes: z.string(),
  }),
]);

export const compatManifestSchema = z.object({
  schemaVersion: z.literal(1),
  framework: z.string(),
  generatedAt: z.string(),
  packages: z.record(z.string(), z.object({ versions: z.array(compatVersionSchema) })),
  overlays: z.array(compatOverlaySchema),
});

export type CompatVersion = z.infer<typeof compatVersionSchema>;
export type CompatOverlay = z.infer<typeof compatOverlaySchema>;
export type CompatManifest = z.infer<typeof compatManifestSchema>;

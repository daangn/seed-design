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
  /** Absolute URL to the raw snippet. Optional so older indexes still parse. */
  url: z.string().optional(),
});

export const docsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  docUrl: z.string(),
  /**
   * Site-relative path to this page's llms.txt, e.g. `/llms/foundations/color.txt`.
   *
   * Carried by the index so the CLI never has to know the route shape. Optional
   * so an older index (or a self-hosted one) still parses; callers fall back to
   * composing it from `docUrl`.
   */
  llmsUrl: z.string().optional(),
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
  /** Site-relative path to the section index llms.txt, e.g. `/components/llms.txt`. */
  llmsIndexUrl: z.string().optional(),
  /** Site-relative path to the whole-section llms-full.txt, when the section has one. */
  llmsFullUrl: z.string().optional(),
  sections: z.array(docsSectionSchema),
});

export const docsIndexSchema = z.object({
  categories: z.array(docsCategorySchema),
});

export type DocsItem = z.infer<typeof docsItemSchema>;
export type DocsSection = z.infer<typeof docsSectionSchema>;
export type DocsCategory = z.infer<typeof docsCategorySchema>;
export type DocsIndex = z.infer<typeof docsIndexSchema>;

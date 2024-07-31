import { z } from "zod";

// TODO: Extract this to a shared package.
// INFO: also used in component-docs
export const componentMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  innerDependencies: z.array(z.string()).optional(),
  snippets: z.array(z.string()),
  type: z.enum(["component"]),
});

export const componentMetadataIndexSchema = z.array(componentMetadataSchema);

const omittedComponentMetadataIndexSchema = componentMetadataSchema.omit({ snippets: true });

export const componentMetadataSchemaWithRegistry = omittedComponentMetadataIndexSchema.extend({
  registries: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    }),
  ),
});

export const componentMetadataWithRegistrySchema = z.array(componentMetadataSchemaWithRegistry);

export type ComponentMetadata = z.infer<typeof componentMetadataSchema>;

export type ComponentMetadataWithRegistrySchema = z.infer<
  typeof componentMetadataSchemaWithRegistry
>;

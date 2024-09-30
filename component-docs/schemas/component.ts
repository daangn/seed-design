import { z } from "zod";

export const componentMetadataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  innerDependencies: z.array(z.string()).optional(),
  snippets: z.array(z.string()),
  type: z.enum(["component"]),
});

export const componentRegistrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  innerDependencies: z.array(z.string()).optional(),
  registries: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    }),
  ),
  type: z.enum(["component"]),
});

export type ComponentMetadataSchema = z.infer<typeof componentMetadataSchema>;
export type ComponentRegistrySchema = z.infer<typeof componentRegistrySchema>;

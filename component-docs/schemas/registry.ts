import { z } from "zod";

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

export const componentRegistriesSchema = z.array(componentRegistrySchema);

export type ComponentRegistry = z.infer<typeof componentRegistrySchema>;

export type ComponentRegistries = z.infer<typeof componentRegistriesSchema>;

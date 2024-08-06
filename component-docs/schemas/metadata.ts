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

export const componentMetadatasSchema = z.array(componentMetadataSchema);

export type ComponentMetadata = z.infer<typeof componentMetadataSchema>;

export type ComponentMetadatas = z.infer<typeof componentMetadatasSchema>;

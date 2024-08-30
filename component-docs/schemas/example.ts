import { z } from "zod";

export const componentExampleSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  innerDependencies: z.array(z.string()).optional(),
  snippets: z.array(z.string()),
});

export const componentExamplesSchema = z.array(componentExampleSchema);

export type ComponentExample = z.infer<typeof componentExampleSchema>;

export type ComponentExamples = z.infer<typeof componentExamplesSchema>;

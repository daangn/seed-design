import type { ExampleMetadataSchema } from "../schemas/example";

export const exampleMetadatas: ExampleMetadataSchema[] = [
  {
    name: "chip-tabs-stackflow-default",
    type: "stackflow",
    snippets: ["example/chip-tabs-stackflow-default.tsx"],
    innerDependencies: ["chip-tabs"],
  },
];

import type { Registry } from "../schema";

export const registryLib: Registry = {
  id: "lib",
  hideFromCLICatalog: true,
  items: [
    {
      id: "manner-temp-level",
      snippets: [{ path: "manner-temp-level.ts" }],
    },
    {
      id: "format-bytes",
      snippets: [{ path: "format-bytes.ts" }],
    },
    {
      id: "attachment-reorder",
      snippets: [
        {
          path: "attachment-reorder.ts",
          dependencies: {
            "@dnd-kit/react": "^0.4.0",
            "@dnd-kit/abstract": "^0.4.0",
          },
        },
      ],
    },
  ],
};

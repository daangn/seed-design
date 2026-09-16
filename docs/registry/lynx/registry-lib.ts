import type { Registry } from "../schema";

export const registryLib: Registry = {
  id: "lib",
  hideFromCLICatalog: true,
  items: [
    {
      id: "attachment-sortable",
      snippets: [
        {
          path: "attachment-sortable.tsx",
        },
      ],
    },
  ],
};

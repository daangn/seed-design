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
      id: "pagination-button",
      snippets: [
        {
          path: "pagination-button.tsx",
          dependencies: { "@seed-design/react": "^2.3.0", "@seed-design/css": "^2.6.0" },
        },
      ],
    },
    {
      id: "pagination-page-item",
      snippets: [
        {
          path: "pagination-page-item.tsx",
          dependencies: { "@seed-design/css": "^2.6.0" },
        },
      ],
    },
  ],
};

import type { Registry } from "./schema";

export const registryLib: Registry = {
  id: "lib",
  hideFromCLICatalog: true,
  items: [
    {
      id: "manner-temp-level",
      snippets: [{ path: "manner-temp-level.ts" }],
    },
  ],
};

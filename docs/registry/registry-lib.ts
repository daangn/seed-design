import type { Registry } from "./schema";

export const registryLib: Registry = {
  id: "lib",
  hideFromCLICatalog: true,
  items: [
    {
      id: "manner-temp-level",
      snippets: [{ path: "manner-temp-level.ts" }],
    },
    {
      id: "phone-number-field",
      snippets: [
        {
          path: "phone-number-field.ts",
          dependencies: { "@seed-design/react": "~1.1.0", "libphonenumber-js": "^1.12.36" },
        },
      ],
    },
  ],
};

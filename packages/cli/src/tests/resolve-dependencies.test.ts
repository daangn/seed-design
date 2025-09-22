import { describe, it, expect } from "vitest";
import { resolveDependencies } from "../utils/resolve-dependencies";
import type { PublicRegistry } from "@/src/schema";

describe("resolveDependencies", () => {
  it("should resolve a simple item without dependencies", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "button",
            description: "Button component",
            snippets: [{ path: "button.tsx" }],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:button"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(1);
    expect(result.registryItemsToAdd[0]).toEqual({
      registryId: "ui",
      items: [
        {
          id: "button",
          description: "Button component",
          files: [{ path: "button.tsx" }],
        },
      ],
    });
    expect(result.npmDependenciesToAdd.size).toBe(0);
  });

  it("should resolve npm dependencies", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "tabs",
            description: "Tabs component",
            snippets: [{ path: "tabs.tsx" }],
            dependencies: ["@seed-design/react-tabs", "clsx"],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:tabs"],
      publicRegistries,
    });

    expect(result.npmDependenciesToAdd.size).toBe(2);
    expect(result.npmDependenciesToAdd.has("@seed-design/react-tabs")).toBe(true);
    expect(result.npmDependenciesToAdd.has("clsx")).toBe(true);
  });

  it("should resolve inner dependencies recursively", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "dialog",
            description: "Dialog component",
            snippets: [{ path: "dialog.tsx" }],
            innerDependencies: [
              {
                registryId: "breeze",
                itemIds: ["animate-number"],
              },
            ],
          },
        ],
      },
      {
        id: "breeze",
        items: [
          {
            id: "animate-number",
            description: "Animate number utility",
            snippets: [{ path: "animate-number.ts" }],
            dependencies: ["framer-motion"],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:dialog"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(2);
    expect(result.registryItemsToAdd).toEqual([
      {
        registryId: "ui",
        items: [
          {
            id: "dialog",
            description: "Dialog component",
            files: [{ path: "dialog.tsx" }],
            innerDependencies: [
              {
                registryId: "breeze",
                itemIds: ["animate-number"],
              },
            ],
          },
        ],
      },
      {
        registryId: "breeze",
        items: [
          {
            id: "animate-number",
            description: "Animate number utility",
            files: [{ path: "animate-number.ts" }],
            dependencies: ["framer-motion"],
          },
        ],
      },
    ]);
    expect(result.npmDependenciesToAdd.size).toBe(1);
    expect(result.npmDependenciesToAdd.has("framer-motion")).toBe(true);
  });

  it("should handle multiple selected items", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "button",
            description: "Button component",
            snippets: [{ path: "button.tsx" }],
          },
          {
            id: "chip",
            description: "Chip component",
            snippets: [{ path: "chip.tsx" }],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:button", "ui:chip"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(1);
    expect(result.registryItemsToAdd[0].registryId).toBe("ui");
    expect(result.registryItemsToAdd[0].items).toHaveLength(2);
    expect(result.registryItemsToAdd[0].items.map((i) => i.id)).toEqual(["button", "chip"]);
  });

  it("should prevent duplicate items", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "dialog",
            description: "Dialog component",
            snippets: [{ path: "dialog.tsx" }],
            innerDependencies: [
              {
                registryId: "ui",
                itemIds: ["button"],
              },
            ],
          },
          {
            id: "button",
            description: "Button component",
            snippets: [{ path: "button.tsx" }],
          },
        ],
      },
    ];

    // Select both dialog and button, but button is already a dependency of dialog
    const result = resolveDependencies({
      selectedItemKeys: ["ui:dialog", "ui:button"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(1);
    expect(result.registryItemsToAdd[0].items).toHaveLength(2);
    // Button should appear only once
    const buttonCount = result.registryItemsToAdd[0].items.filter((i) => i.id === "button").length;
    expect(buttonCount).toBe(1);
  });

  it("should handle nested inner dependencies", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "complex",
            description: "Complex component",
            snippets: [{ path: "complex.tsx" }],
            innerDependencies: [
              {
                registryId: "ui",
                itemIds: ["dialog"],
              },
            ],
          },
          {
            id: "dialog",
            description: "Dialog component",
            snippets: [{ path: "dialog.tsx" }],
            innerDependencies: [
              {
                registryId: "breeze",
                itemIds: ["animate"],
              },
            ],
          },
        ],
      },
      {
        id: "breeze",
        items: [
          {
            id: "animate",
            description: "Animate utility",
            snippets: [{ path: "animate.ts" }],
            innerDependencies: [
              {
                registryId: "lib",
                itemIds: ["utils"],
              },
            ],
          },
        ],
      },
      {
        id: "lib",
        items: [
          {
            id: "utils",
            description: "Utility functions",
            snippets: [{ path: "utils.ts" }],
            dependencies: ["lodash"],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:complex"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(3);
    expect(result.registryItemsToAdd.map((r) => r.registryId)).toEqual(["ui", "breeze", "lib"]);
    expect(result.npmDependenciesToAdd.size).toBe(1);
    expect(result.npmDependenciesToAdd.has("lodash")).toBe(true);
  });

  it("should throw error for invalid snippet format", () => {
    const publicRegistries: PublicRegistry[] = [];

    expect(() =>
      resolveDependencies({
        selectedItemKeys: ["invalid-format"],
        publicRegistries,
      }),
    ).toThrowError('Invalid snippet format: "invalid-format"');
  });

  it("should throw error for non-existent snippet", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [],
      },
    ];

    expect(() =>
      resolveDependencies({
        selectedItemKeys: ["ui:non-existent"],
        publicRegistries,
      }),
    ).toThrowError('Cannot find snippet: "ui:non-existent"');
  });

  it("should throw error for missing inner dependency", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "broken",
            description: "Broken component",
            snippets: [{ path: "broken.tsx" }],
            innerDependencies: [
              {
                registryId: "breeze",
                itemIds: ["missing"],
              },
            ],
          },
        ],
      },
      {
        id: "breeze",
        items: [],
      },
    ];

    expect(() =>
      resolveDependencies({
        selectedItemKeys: ["ui:broken"],
        publicRegistries,
      }),
    ).toThrowError("Cannot find dependency item: breeze:missing");
  });

  it("should handle multiple registries with multiple items", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "button",
            description: "Button component",
            snippets: [{ path: "button.tsx" }],
            dependencies: ["clsx"],
          },
          {
            id: "chip",
            description: "Chip component",
            snippets: [{ path: "chip.tsx" }],
          },
        ],
      },
      {
        id: "breeze",
        items: [
          {
            id: "animate",
            description: "Animate utility",
            snippets: [{ path: "animate.ts" }],
            dependencies: ["framer-motion"],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:button", "breeze:animate", "ui:chip"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(2);

    const uiRegistry = result.registryItemsToAdd.find((r) => r.registryId === "ui");
    expect(uiRegistry?.items).toHaveLength(2);
    expect(uiRegistry?.items.map((i) => i.id)).toEqual(["button", "chip"]);

    const breezeRegistry = result.registryItemsToAdd.find((r) => r.registryId === "breeze");
    expect(breezeRegistry?.items).toHaveLength(1);
    expect(breezeRegistry?.items[0].id).toBe("animate");

    expect(result.npmDependenciesToAdd.size).toBe(2);
    expect(result.npmDependenciesToAdd.has("clsx")).toBe(true);
    expect(result.npmDependenciesToAdd.has("framer-motion")).toBe(true);
  });

  it("should collect all npm dependencies from nested dependencies", () => {
    const publicRegistries: PublicRegistry[] = [
      {
        id: "ui",
        items: [
          {
            id: "rich",
            description: "Rich component",
            snippets: [{ path: "rich.tsx" }],
            dependencies: ["react-hook-form"],
            innerDependencies: [
              {
                registryId: "ui",
                itemIds: ["field", "label"],
              },
            ],
          },
          {
            id: "field",
            description: "Field component",
            snippets: [{ path: "field.tsx" }],
            dependencies: ["clsx", "tailwind-merge"],
          },
          {
            id: "label",
            description: "Label component",
            snippets: [{ path: "label.tsx" }],
            dependencies: ["clsx"],
          },
        ],
      },
    ];

    const result = resolveDependencies({
      selectedItemKeys: ["ui:rich"],
      publicRegistries,
    });

    expect(result.npmDependenciesToAdd.size).toBe(3);
    expect(result.npmDependenciesToAdd.has("react-hook-form")).toBe(true);
    expect(result.npmDependenciesToAdd.has("clsx")).toBe(true);
    expect(result.npmDependenciesToAdd.has("tailwind-merge")).toBe(true);
  });
});

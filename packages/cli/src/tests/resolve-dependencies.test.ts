import { describe, it, expect } from "bun:test";
import { resolveDependencies } from "../utils/resolve-dependencies";
import type { PublicRegistry } from "@/src/schema";

describe("resolveDependencies", () => {
  it("의존성이 없는 단일 아이템을 해석해야 한다", () => {
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
          snippets: [{ path: "button.tsx" }],
        },
      ],
    });
    expect(result.npmDependenciesToAdd.size).toBe(0);
  });

  it("npm 의존성을 수집해야 한다", () => {
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

  it("innerDependencies를 재귀적으로 해석해야 한다", () => {
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
        registryId: "breeze",
        items: [
          {
            id: "animate-number",
            description: "Animate number utility",
            snippets: [{ path: "animate-number.ts" }],
            dependencies: ["framer-motion"],
          },
        ],
      },
    ]);
    expect(result.npmDependenciesToAdd.size).toBe(1);
    expect(result.npmDependenciesToAdd.has("framer-motion")).toBe(true);
  });

  it("여러 선택 아이템을 함께 처리해야 한다", () => {
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

  it("중복 아이템을 제거해야 한다", () => {
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

    // dialog와 button을 동시에 선택해도 button은 dialog 의존성으로 이미 포함된다.
    const result = resolveDependencies({
      selectedItemKeys: ["ui:dialog", "ui:button"],
      publicRegistries,
    });

    expect(result.registryItemsToAdd).toHaveLength(1);
    expect(result.registryItemsToAdd[0].items).toHaveLength(2);
    // button은 한 번만 포함되어야 한다.
    const buttonCount = result.registryItemsToAdd[0].items.filter((i) => i.id === "button").length;
    expect(buttonCount).toBe(1);
  });

  it("중첩된 innerDependencies를 처리해야 한다", () => {
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

  it("잘못된 스니펫 포맷이면 에러를 던져야 한다", () => {
    const publicRegistries: PublicRegistry[] = [];

    expect(() =>
      resolveDependencies({
        selectedItemKeys: ["invalid-format"],
        publicRegistries,
      }),
    ).toThrowError('Invalid snippet format: "invalid-format"');
  });

  it("존재하지 않는 스니펫이면 에러를 던져야 한다", () => {
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

  it("inner dependency가 누락되면 에러를 던져야 한다", () => {
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

  it("여러 레지스트리와 아이템을 함께 처리해야 한다", () => {
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

  it("중첩 의존성의 npm 패키지를 모두 수집해야 한다", () => {
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

import { describe, expect, it } from "bun:test";
import { Authoring } from "@seed-design/rootage-core";

import generateSeedComponentSpec from "./src/seed-component-spec";
import * as componentVars from "./src/vars/component";
import { remToSp } from "./src/utils/sp";

function collectRemPaths(value: unknown, path: string): string[] {
  if (typeof value === "string") return /\d(?:\.\d+)?rem\b/.test(value) ? [path] : [];
  if (typeof value !== "object" || value === null) return [];

  return Object.entries(value).flatMap(([key, child]) => collectRemPaths(child, `${path}.${key}`));
}

describe("remToSp", () => {
  it("converts rem to sp at 16sp per rem", () => {
    expect([0.125, 0.375, 1, 1.0625].map(remToSp)).toEqual(["2sp", "6sp", "16sp", "17sp"]);
  });
});

describe("generateSeedComponentSpec", () => {
  it("writes rem dimensions as sp and leaves px and token references as is", async () => {
    const spec = Authoring.parseComponentSpecDocument({
      kind: "ComponentSpec",
      metadata: { id: "test", name: "test" },
      data: {
        schema: {
          slots: {
            root: {
              properties: {
                size: { type: "dimension" },
                paddingX: { type: "dimension" },
                gap: { type: "dimension" },
              },
            },
          },
        },
        definitions: {
          base: { enabled: { root: { size: "0.375rem", paddingX: "4px", gap: "$dimension.x2" } } },
        },
      },
    }).data;

    const files = await generateSeedComponentSpec(
      { componentSpecs: [spec] },
      { prefix: "seed", resolveTokenValues: () => undefined },
    );

    expect(files.find(({ path }) => path === "test.mjs")?.code).toBe(`export const vars = {
  "base": {
    "enabled": {
      "root": {
        "size": "6sp",
        "paddingX": "4px",
        "gap": "var(--seed-dimension-x2)"
      }
    }
  }
}`);
  });
});

describe("component vars", () => {
  it("contain no rem, which ignores the font scale in Lynx", () => {
    expect(collectRemPaths(componentVars, "vars")).toEqual([]);
  });
});

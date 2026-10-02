import { describe, expect, it } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import type { DocsItem } from "../../../docs/scripts/archive-index-types";
import {
  type RegistryMapEntry,
  compareDocsItems,
  filePathToSlugs,
  findRegistryEntry,
  getSnippetLabel,
} from "../../../docs/scripts/generate-react-archive-index";

// 실제 public/__registry__ 인덱스 대신 쓰는 합성 레지스트리. 레지스트리를 재생성해도 이 기대값은 흔들리지 않는다.
function registryEntry(framework: "react" | "lynx", registryId: string): RegistryMapEntry {
  return {
    framework,
    registryId,
    snippets: [{ label: "react", path: `${framework}/${registryId}/snippet.tsx` }],
  };
}

const registryMap = new Map<string, RegistryMapEntry>([
  ["react/ui:action-button", registryEntry("react", "ui")],
  ["react/breeze:animate-number", registryEntry("react", "breeze")],
  ["lynx/ui:checkbox", registryEntry("lynx", "ui")],
  // 세 레지스트리가 같은 id를 모두 가져야 카테고리별 라우팅이 서로 구별된다.
  ["react/ui:shared", registryEntry("react", "ui")],
  ["react/breeze:shared", registryEntry("react", "breeze")],
  ["lynx/ui:shared", registryEntry("lynx", "ui")],
]);

// snippetKey는 `${framework}/${registryId}:${itemId}` 이므로, 여기서 고른 항목의
// framework·registryId가 곧 생성물의 snippetKey를 결정한다.
describe("findRegistryEntry", () => {
  it("routes React content to the react/ui registry", () => {
    expect(findRegistryEntry(registryMap, "react", "shared")).toEqual(registryEntry("react", "ui"));
  });

  it("routes framework-agnostic design content to the react/ui registry", () => {
    expect(findRegistryEntry(registryMap, "docs", "shared")).toEqual(registryEntry("react", "ui"));
  });

  it("routes Breeze content to the react/breeze registry", () => {
    expect(findRegistryEntry(registryMap, "breeze", "shared")).toEqual(
      registryEntry("react", "breeze"),
    );
  });

  it("routes Lynx content to the lynx/ui registry", () => {
    expect(findRegistryEntry(registryMap, "lynx", "shared")).toEqual(registryEntry("lynx", "ui"));
  });

  it("falls back to react/breeze when react/ui has no item with that id", () => {
    expect(findRegistryEntry(registryMap, "react", "animate-number")).toEqual(
      registryEntry("react", "breeze"),
    );
  });

  it("does not let Lynx content fall back to a React registry with the same id", () => {
    expect(findRegistryEntry(registryMap, "lynx", "action-button")).toBeUndefined();
  });

  it("does not let Breeze content fall back to the react/ui registry", () => {
    expect(findRegistryEntry(registryMap, "breeze", "action-button")).toBeUndefined();
  });

  it("returns nothing for a category with no registry", () => {
    expect(findRegistryEntry(registryMap, "ai-integration", "shared")).toBeUndefined();
  });

  it("returns nothing when no registry has the item", () => {
    expect(findRegistryEntry(registryMap, "react", "nonexistent")).toBeUndefined();
  });
});

function docsItem(id: string, docUrl: string): DocsItem {
  return { id, title: id, docUrl };
}

describe("compareDocsItems", () => {
  it("orders by item id first", () => {
    expect(compareDocsItems(docsItem("avatar", "/react/z"), docsItem("badge", "/react/a"))).toBe(
      -1,
    );
    expect(compareDocsItems(docsItem("badge", "/react/a"), docsItem("avatar", "/react/z"))).toBe(1);
  });

  it("falls back to the document URL when two items share an id", () => {
    expect(
      compareDocsItems(
        docsItem("composition", "/react/components/concepts/composition"),
        docsItem("composition", "/react/components/iconography/composition"),
      ),
    ).toBe(-1);
  });

  it("treats an identical id and URL as equal", () => {
    expect(
      compareDocsItems(docsItem("composition", "/react/a"), docsItem("composition", "/react/a")),
    ).toBe(0);
  });

  // 타이브레이커가 없으면 입력 순서에 따라 결과가 갈려 생성물이 재생성마다 흔들린다.
  it("sorts duplicate ids into the same URL order whatever the input order is", () => {
    const avatar = docsItem("avatar", "/react/components/avatar");
    const concepts = docsItem("composition", "/react/components/concepts/composition");
    const iconography = docsItem("composition", "/react/components/iconography/composition");
    const expected = [avatar, concepts, iconography];

    expect([iconography, avatar, concepts].sort(compareDocsItems)).toEqual(expected);
    expect([concepts, iconography, avatar].sort(compareDocsItems)).toEqual(expected);
  });
});

describe("filePathToSlugs", () => {
  it("drops the .mdx extension", () => {
    expect(filePathToSlugs("action-button.mdx")).toEqual(["action-button"]);
  });

  it("splits nested directories into slugs", () => {
    expect(filePathToSlugs("components/concepts/composition.mdx")).toEqual([
      "components",
      "concepts",
      "composition",
    ]);
  });

  it("strips route group directories", () => {
    expect(filePathToSlugs("components/(buttons)/action-button.mdx")).toEqual([
      "components",
      "action-button",
    ]);
  });

  it("returns null for the content dir root index", () => {
    expect(filePathToSlugs("index.mdx")).toBeNull();
  });

  it("maps a nested index onto its directory", () => {
    expect(filePathToSlugs("components/index.mdx")).toEqual(["components"]);
  });
});

describe("getSnippetLabel", () => {
  const cases: [filePath: string, expected: string][] = [
    ["ActionButton.tsx", "react"],
    ["ActionButton.jsx", "react"],
    ["use-action-button.ts", "ts"],
    ["use-action-button.js", "js"],
    ["action-button.css", "css"],
    // .css보다 먼저 걸러야 ".module.css"가 css로 붙는다.
    ["action-button.module.css", "css"],
    ["action-button.mjs", "mjs"],
  ];

  for (const [filePath, expected] of cases) {
    it(`labels ${filePath} as ${expected}`, () => {
      expect(getSnippetLabel(filePath)).toBe(expected);
    });
  }
});

describe("archive docs index generation", () => {
  const generator = path.join(
    import.meta.dir,
    "../../../docs/scripts/generate-react-archive-index.ts",
  );
  it("indexes this archive's React source and preserves snippet contracts", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "seed-docs-index-"));
    try {
      const write = (name: string, value: string) => {
        mkdirSync(path.dirname(path.join(cwd, name)), { recursive: true });
        writeFileSync(path.join(cwd, name), value);
      };
      write(
        "content/react/components/(buttons)/action-button.mdx",
        "---\ntitle: Legacy button\ndescription: Retained API\n---\nOriginal version content.",
      );
      write("content/lynx/components/new-component.mdx", "---\ntitle: Excluded\n---");
      write(
        "public/__registry__/react/ui/index.json",
        JSON.stringify({
          id: "ui",
          items: [{ id: "action-button", snippets: [{ path: "react/ui/action-button.tsx" }] }],
        }),
      );
      const result = spawnSync("bun", [generator], { cwd });
      expect(result.status).toBe(0);
      expect(JSON.parse(readFileSync(path.join(cwd, ".archive/index.json"), "utf8"))).toEqual({
        categories: [
          {
            id: "react",
            label: "React",
            sections: [
              {
                id: "components",
                label: "컴포넌트",
                items: [
                  {
                    id: "action-button",
                    title: "Legacy button",
                    description: "Retained API",
                    docUrl: "/react/components/action-button",
                    snippetKey: "react/ui:action-button",
                    snippets: [{ label: "react", path: "react/ui/action-button.tsx" }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(existsSync(path.join(cwd, "public/__docs__/index.json"))).toBe(false);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
  it("fails without writing an index when React source is missing", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "seed-docs-index-"));
    try {
      const result = spawnSync("bun", [generator], { cwd });
      expect(result.status).toBe(1);
      expect(existsSync(path.join(cwd, ".archive/index.json"))).toBe(false);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

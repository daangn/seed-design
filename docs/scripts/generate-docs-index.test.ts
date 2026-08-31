import { describe, expect, it } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { docsIndexSchema, type DocsItem } from "../../packages/cli/src/schema";
import { filePathToSlugs } from "./content-pages";
import { compareDocsItems } from "./generate-docs-index";

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

  it("returns no slugs for the content dir root index", () => {
    expect(filePathToSlugs("index.mdx")).toEqual([]);
  });

  it("maps a nested index onto its directory", () => {
    expect(filePathToSlugs("components/index.mdx")).toEqual(["components"]);
  });
});

// 실제 생성물을 지나는 유일한 테스트라, 개별 문서가 아니라 문서 페이지가 늘거나 줄어도
// 움직이지 않는 스키마 적합성과 정렬 불변식만 본다. 읽기는 import 시점이 아니라 테스트 안에서 한다.
describe("generated docs index artifact", () => {
  function readDocsIndex() {
    const raw = readFileSync(path.join(import.meta.dir, "../public/__docs__/index.json"), "utf-8");
    return docsIndexSchema.parse(JSON.parse(raw));
  }

  it("satisfies the docs index schema", () => {
    expect(() => readDocsIndex()).not.toThrow();
  });

  it("keeps every category's items in compareDocsItems order", () => {
    for (const { items } of readDocsIndex().categories) {
      expect(items).toEqual([...items].sort(compareDocsItems));
    }
  });
});

describe("generated docs index source directories", () => {
  it("fails without writing an index when a source directory is missing", async () => {
    // Driven as a process because the assertions are the exit code and the absence of a written
    // index.json, and `main()` is not exported. An empty cwd makes the first `sources` entry the
    // missing one.
    const cwd = mkdtempSync(path.join(tmpdir(), "seed-docs-index-"));

    try {
      const proc = Bun.spawn(["bun", path.join(import.meta.dir, "generate-docs-index.ts")], {
        cwd,
        stdout: "pipe",
        stderr: "pipe",
      });
      const [stderr, exitCode] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);

      expect(exitCode).toBe(1);
      expect(stderr).toContain("Content directory not found:");
      expect(existsSync(path.join(cwd, "public", "__docs__", "index.json"))).toBe(false);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

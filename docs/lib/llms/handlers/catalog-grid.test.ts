import { describe, expect, it } from "bun:test";
import { type CatalogGridManifestEntry, catalogGridManifest } from "../component-grid-manifest";
import { renderWithHandler } from "../render-test-utils";
import { catalogGridHandler, createCatalogGridHandler } from "./catalog-grid";

// 합성 매니페스트. 실제 문서가 늘거나 줄어도 이 기대값은 흔들리지 않는다. 어느 페이지를
// 싣고 뺄지는 scripts/generate-component-grid-manifest.ts의 몫이라 여기서 보지 않는다.
const entry = (slug: string, title: string, description = ""): CatalogGridManifestEntry => ({
  slug,
  title,
  description,
});

const manifest = {
  "/sorted/": [entry("a-page", "Zebra"), entry("z-page", "Apple")],
  "/described/": [entry("kept", "Kept", "설명")],
  "/empty/": [],
};

const render = (mdx: string) => renderWithHandler(createCatalogGridHandler(manifest), mdx);

describe("catalog grid handler", () => {
  it("lists a section's pages as markdown links", async () => {
    const actual = await render(`<CatalogGrid pathPrefix="/docs/described/" />`);

    expect(actual).toBe("- [Kept](https://seed-design.io/llms/docs/described/kept.txt) — 설명");
  });

  it("sorts by title rather than by slug", async () => {
    const actual = await render(`<CatalogGrid pathPrefix="/docs/sorted/" />`);

    expect(actual).toBe(
      [
        "- [Apple](https://seed-design.io/llms/docs/sorted/z-page.txt)",
        "- [Zebra](https://seed-design.io/llms/docs/sorted/a-page.txt)",
      ].join("\n"),
    );
  });

  it("keeps the tag when the section has nothing to list", async () => {
    const actual = await render(`<CatalogGrid pathPrefix="/docs/empty/" />`);

    expect(actual).toBe(`<CatalogGrid pathPrefix="/docs/empty/" />`);
  });

  it("keeps the tag when the manifest has no such section", async () => {
    const actual = await render(`<CatalogGrid pathPrefix="/nowhere/" />`);

    expect(actual).toBe(`<CatalogGrid pathPrefix="/nowhere/" />`);
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<SomethingElse />")).toBe("<SomethingElse />");
  });

  // 매니페스트를 실제로 물고 있는지 확인한다. 합성 데이터만 보면 기본 핸들러가 빈
  // 매니페스트를 들고 있어도 테스트는 전부 통과한다. 어느 문서가 실렸는지가 아니라
  // 연결 여부만 보므로 문서가 늘거나 줄어도 흔들리지 않는다.
  it("ships with the generated manifest wired in", async () => {
    const [somePrefix, entries] = Object.entries(catalogGridManifest).find(
      ([, value]) => value.length > 0,
    ) as [string, readonly CatalogGridManifestEntry[]];

    const actual = await renderWithHandler(
      catalogGridHandler,
      `<CatalogGrid pathPrefix="${somePrefix}" />`,
    );

    expect(actual.split("\n")).toHaveLength(entries.length);
    expect(actual.startsWith("- [")).toBe(true);
  });
});

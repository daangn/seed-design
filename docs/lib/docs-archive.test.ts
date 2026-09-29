import { describe, expect, it } from "bun:test";
import { createArchivePaths } from "./docs-archive";

describe("documentation archive paths", () => {
  it("leaves the latest Pages build unchanged", () => {
    const paths = createArchivePaths("");
    expect([
      paths.reactBase,
      paths.link("/react/components/button"),
      paths.asset("/logo.webp"),
      paths.endpoint("/api/search"),
    ]).toEqual(["/react", "/react/components/button", "/logo.webp", "/api/search"]);
    expect(paths.routeSlug(["components", "button"])).toEqual(["components", "button"]);
  });

  it.each([
    "v2",
    "v3",
  ])("isolates %s pages, endpoints and assets without nesting react twice", (version) => {
    const paths = createArchivePaths(version);
    expect([
      paths.link("/react"),
      paths.link("/react/components/button?x=1#usage"),
      paths.asset("/logo.webp"),
      paths.endpoint("/__registry__/react/ui/button.json"),
    ]).toEqual([
      `/react/${version}`,
      `/react/${version}/components/button?x=1#usage`,
      `/react/${version}/_assets/logo.webp`,
      `/react/${version}/__registry__/react/ui/button.json`,
    ]);
    expect(paths.routeSlug(["components", "button"])).toEqual([version, "components", "button"]);
    expect(paths.contentSlug([version, "components", "button"])).toEqual(["components", "button"]);
  });

  it("keeps shared content and the other platform on the latest site", () => {
    const paths = createArchivePaths("v2");
    expect([paths.link("/"), paths.link("/lynx"), paths.link("/updates/article")]).toEqual([
      "https://seed-design.io/",
      "https://seed-design.io/lynx",
      "https://seed-design.io/updates/article",
    ]);
  });

  it("does not rewrite scoped, external or fragment links", () => {
    const paths = createArchivePaths("v2");
    const links = [
      "/react/v2/components/button",
      "/react/v2?query=1",
      "/react/v2#top",
      "https://seed-design.io/react",
      "//example.com/a",
      "#usage",
    ];
    expect(links.map(paths.link)).toEqual(links);
    expect(paths.asset("/react/v2/_assets/logo.webp")).toBe("/react/v2/_assets/logo.webp");
  });

  it.each([
    "v0",
    "v1.2",
    "v2.1",
    "latest",
    "v2/../../../",
    "2",
  ])("rejects unsupported archive version %s", (version) => {
    expect(() => createArchivePaths(version)).toThrow();
  });
});

import { describe, expect, it } from "bun:test";
import { assertReactArchiveSource, createArchivePaths } from "./docs-archive";

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
    "1.0",
    "1.1",
    "1.2",
    "2.0",
    "3.0",
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
    const paths = createArchivePaths("2.0");
    expect([paths.link("/"), paths.link("/lynx"), paths.link("/updates/article")]).toEqual([
      "https://seed-design.io/",
      "https://seed-design.io/lynx",
      "https://seed-design.io/updates/article",
    ]);
  });

  it("does not rewrite scoped, external or fragment links", () => {
    const paths = createArchivePaths("2.0");
    const links = [
      "/react/2.0/components/button",
      "/react/2.0?query=1",
      "/react/2.0#top",
      "https://seed-design.io/react",
      "//example.com/a",
      "#usage",
    ];
    expect(links.map(paths.link)).toEqual(links);
    expect(paths.asset("/react/2.0/_assets/logo.webp")).toBe("/react/2.0/_assets/logo.webp");
  });

  it.each([
    "v0",
    "1.0.2",
    "2.0.1",
    "latest",
    "2.0/../../../",
    "2",
    "v2",
    "v2.0",
    "02.0",
    "2.00",
  ])("rejects unsupported archive version %s", (version) => {
    expect(() => createArchivePaths(version)).toThrow();
  });

  it.each([
    ["1.0", "1.0.9"],
    ["1.1", "1.1.4"],
    ["1.2", "1.2.3"],
    ["2.0", "2.5.0"],
    ["3.0", "3.4.1"],
  ])("accepts archive channel %s from React %s", (channel, version) => {
    expect(() => assertReactArchiveSource(channel, version)).not.toThrow();
  });

  it.each([
    ["1.0", "1.1.0"],
    ["1.1", "1.2.0"],
    ["2.0", "3.0.0"],
    ["2.1", "2.1.0"],
    ["", "2.5.0"],
  ])("rejects archive channel %s from React %s", (channel, version) => {
    expect(() => assertReactArchiveSource(channel, version)).toThrow();
  });
});

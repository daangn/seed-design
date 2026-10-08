import { describe, expect, it } from "bun:test";
import { assertArchiveSource, createArchivePaths } from "./docs-archive";

describe("documentation archive paths", () => {
  it("leaves the latest Pages build unchanged", () => {
    const paths = createArchivePaths("");
    expect([
      paths.routes("react").base,
      paths.routes("lynx").base,
      paths.link("/react/components/button"),
      paths.link("/lynx/components/action-button"),
      paths.asset("/logo.webp"),
      paths.asset("/__lynx__/manifest.json"),
      paths.endpoint("/api/search"),
    ]).toEqual([
      "/react",
      "/lynx",
      "/react/components/button",
      "/lynx/components/action-button",
      "/logo.webp",
      "/__lynx__/manifest.json",
      "/api/search",
    ]);
    expect(paths.routes("react").routeSlug(["components", "button"])).toEqual([
      "components",
      "button",
    ]);
    expect(paths.routes("lynx").contentSlug(["v0", "components"])).toEqual(["v0", "components"]);
  });

  it.each([
    "v1.0",
    "v1.1",
    "v1.2",
    "v2",
    "v3",
    "v20",
  ])("isolates %s pages, endpoints and assets without nesting react twice", (version) => {
    const paths = createArchivePaths(`react/${version}`);
    expect([
      paths.routes("react").base,
      paths.link("/react"),
      paths.link("/react/components/button?x=1#usage"),
      paths.asset("/logo.webp"),
      paths.endpoint("/__registry__/react/ui/button.json"),
    ]).toEqual([
      `/react/${version}`,
      `/react/${version}`,
      `/react/${version}/components/button?x=1#usage`,
      `/react/${version}/_assets/logo.webp`,
      `/react/${version}/__registry__/react/ui/button.json`,
    ]);
    const routes = paths.routes("react");
    expect(routes.routeSlug(["components", "button"])).toEqual([version, "components", "button"]);
    expect(routes.contentSlug([version, "components", "button"])).toEqual(["components", "button"]);
  });

  it("isolates Lynx pages and example assets without moving the React routes", () => {
    const paths = createArchivePaths("lynx/v0");
    expect([
      paths.routes("lynx").base,
      paths.routes("react").base,
      paths.link("/lynx"),
      paths.link("/lynx/components/action-button#usage"),
      paths.link("/react/components/action-button"),
      paths.link("/llms/lynx/components/action-button.txt"),
      paths.asset("/__lynx__/badge/preview.12345678.lynx.bundle"),
      paths.asset("/__lynx__/web-core.css"),
    ]).toEqual([
      "/lynx/v0",
      "/react",
      "/lynx/v0",
      "/lynx/v0/components/action-button#usage",
      "https://seed-design.io/react/components/action-button",
      "/lynx/v0/llms/lynx/components/action-button.txt",
      "/lynx/v0/_assets/__lynx__/badge/preview.12345678.lynx.bundle",
      "/lynx/v0/_assets/__lynx__/web-core.css",
    ]);
    expect(paths.routes("lynx").routeSlug(["components"])).toEqual(["v0", "components"]);
    expect(paths.routes("react").routeSlug(["components"])).toEqual(["components"]);
    expect(paths.routes("react").contentSlug(["v0", "components"])).toEqual(["v0", "components"]);
  });

  it("keeps shared content and the other platform on the latest site", () => {
    const paths = createArchivePaths("react/v2");
    expect([
      paths.link("/"),
      paths.link("/lynx"),
      paths.link("/lynxx"),
      paths.link("/updates/article"),
    ]).toEqual([
      "https://seed-design.io/",
      "https://seed-design.io/lynx",
      "https://seed-design.io/lynxx",
      "https://seed-design.io/updates/article",
    ]);
  });

  it("does not rewrite scoped, external or fragment links", () => {
    const paths = createArchivePaths("react/v2");
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
    "v2",
    "react/1.0.2",
    "react/2.0.1",
    "react/latest",
    "react/2.0/../../../",
    "react/2",
    "react/2.0",
    "react/1.2",
    "react/v2.0",
    "react/v2.5",
    "react/v02",
    "react/v1.00",
    "react/02.0",
    "react/2.00",
    "lynx/v00",
    "lynx/v0.10",
    "lynx/v1.0",
    "breeze/v1",
    "react/v2/",
  ])("rejects unsupported archive channel %s", (channel) => {
    expect(() => createArchivePaths(channel)).toThrow();
  });

  it.each([
    ["react/v1.0", "1.0.9"],
    ["react/v1.1", "1.1.4"],
    ["react/v1.2", "1.2.3"],
    ["react/v2", "2.5.0"],
    ["react/v2", "2.9.1"],
    ["react/v3", "3.4.1"],
    ["lynx/v0", "0.10.0"],
    ["lynx/v1", "1.0.0"],
  ])("accepts archive channel %s from source %s", (channel, version) => {
    expect(() => assertArchiveSource(channel, version)).not.toThrow();
  });

  it.each([
    ["react/v1.0", "1.1.0"],
    ["react/v1.1", "1.2.0"],
    ["react/v2", "3.0.0"],
    ["react/v3", "2.5.0"],
    ["react/v2.1", "2.1.0"],
    ["react/2.0", "2.5.0"],
    ["", "2.5.0"],
    ["lynx/v0", "1.0.0"],
    ["lynx/v1", "0.10.0"],
  ])("rejects archive channel %s from source %s", (channel, version) => {
    expect(() => assertArchiveSource(channel, version)).toThrow();
  });
});

it("moves only legacy React links and preserves deep links, queries and fragments", () => {
  const paths = createArchivePaths("react/v1.2");
  expect(
    paths.link("https://v1-0.seed-design.io/react/components/action-button?tab=api#usage"),
  ).toBe("https://seed-design.io/react/v1.0/components/action-button?tab=api#usage");
  expect(paths.link("https://v1-1.seed-design.io/lynx/components/action-button")).toBe(
    "https://v1-1.seed-design.io/lynx/components/action-button",
  );
});

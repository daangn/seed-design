import { expect, it } from "bun:test";
import { type ArchiveDefinition, archivePrefix } from "./config";
import { verifyArchive } from "./verify";

const archive: ArchiveDefinition = {
  platform: "lynx",
  version: "v1",
  origin: "https://lynx-v1.example.pages.dev",
  sourceSha: "a".repeat(40),
  probe: { document: "components/button", registryItem: "ui/button" },
};

function fixture(target: ArchiveDefinition, overrides: Record<string, () => Response> = {}) {
  const prefix = archivePrefix(target);
  const visited: string[] = [];
  const pages: Record<string, () => Response> = {
    "/archive.json": () => Response.json({ ...target, prefix, sourceDirty: false }),
    "/": () =>
      new Response(
        `<link rel="canonical" href="https://seed-design.io${prefix}/"><script src="${prefix}/_assets/_next/static/app.js"></script>`,
      ),
    "/_assets/_next/static/app.js": () => new Response("script"),
    [`/${target.probe.document}/`]: () => new Response("document"),
    "/api/search": () => Response.json({ search: [] }),
    [`/__registry__/${target.platform}/index.json`]: () => Response.json({}),
    [`/__registry__/${target.platform}/${target.probe.registryItem}.json`]: () => Response.json({}),
    "/__docs__/index.json": () => Response.json({ categories: [{ id: target.platform }] }),
    [`/llms/${target.platform}/${target.probe.document}.txt`]: () => new Response("LLM"),
    ...overrides,
  };
  const fetcher = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    expect(init?.redirect).toBe("manual");
    expect(url.origin).toBe(target.origin);
    expect(url.pathname.startsWith(`${prefix}/`)).toBe(true);
    const suffix = url.pathname.slice(prefix.length);
    visited.push(suffix);
    return pages[suffix]?.() ?? new Response("missing", { status: 404 });
  }) as typeof fetch;
  return { fetcher, visited };
}

it.each([
  ["react", "v2"],
  ["react", "v3"],
  ["lynx", "v1"],
])("verifies %s/%s with its own document and registry paths", async (platform, version) => {
  const target = { ...archive, platform, version };
  const { fetcher, visited } = fixture(target);
  await verifyArchive(target, fetcher);
  expect(visited).toContain(`/__registry__/${platform}/ui/button.json`);
  expect(visited).toContain(`/llms/${platform}/components/button.txt`);
  expect(visited.some((path) => path.startsWith("/__archive_missing_"))).toBe(true);
});

it.each([
  { sourceDirty: true },
  { sourceSha: "b".repeat(40) },
  { platform: "react" },
  { version: "v2" },
])("rejects a mismatched or dirty archive manifest %j", async (override) => {
  const { fetcher } = fixture(archive, {
    "/archive.json": () =>
      Response.json({ ...archive, prefix: "/lynx/v1", sourceDirty: false, ...override }),
  });
  await expect(verifyArchive(archive, fetcher)).rejects.toThrow("manifest");
});

it("refuses to follow redirects into another archive or host", async () => {
  for (const location of ["/react/v2/", "https://other.pages.dev/lynx/v1/"]) {
    const { fetcher, visited } = fixture(archive, {
      "/archive.json": () => new Response(null, { status: 302, headers: { location } }),
    });
    await expect(verifyArchive(archive, fetcher)).rejects.toThrow("escaped");
    expect(visited).toEqual(["/archive.json"]);
  }
});

it("bounds redirect loops", async () => {
  const { fetcher } = fixture(archive, {
    "/archive.json": () =>
      new Response(null, { status: 302, headers: { location: "/lynx/v1/archive.json" } }),
  });
  await expect(verifyArchive(archive, fetcher)).rejects.toThrow("too many");
});

it("rejects another platform's docs index", async () => {
  const { fetcher } = fixture(archive, {
    "/__docs__/index.json": () => Response.json({ categories: [{ id: "react" }] }),
  });
  await expect(verifyArchive(archive, fetcher)).rejects.toThrow("contain lynx only");
});

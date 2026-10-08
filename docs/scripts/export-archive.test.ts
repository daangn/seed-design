import { afterEach, expect, it } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { exportArchive } from "./export-archive";

const directories: string[] = [];
afterEach(async () => {
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function fixture() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "seed-archive-"));
  directories.push(dir);
  const write = async (name: string, content: string) => {
    await mkdir(path.dirname(path.join(dir, name)), { recursive: true });
    await writeFile(path.join(dir, name), content);
  };
  for (const [name, content] of Object.entries({
    "out/react/v2/index.html": "archive page",
    "out/react/v2/components/button/index.html": "archive button",
    "out/_next/static/chunk.js": "archive chunk",
    "out/blocks/footer-01/index.html": "block example",
    "public/logo.svg": "logo",
    "out/logo.svg": "logo",
    "public/site.webmanifest": '{"icons":[{"src":"/logo.svg"}]}',
    "public/react/cover.png": "cover",
    "out/site.webmanifest": '{"icons":[{"src":"/logo.svg"}]}',
    "public/_redirects": "/react/old /react/new 301\n/lynx/old /lynx/new 301\n",
    "out/__registry__/react/ui/button.json": '{"id":"ui/button"}',
    "out/__registry__/lynx/ui/button.json": "lynx must not be copied",
    "out/__docs__/index.json": JSON.stringify({
      categories: [
        { id: "react", sections: [{ items: [{ docUrl: "/react/components/button" }] }] },
        { id: "lynx", sections: [] },
      ],
    }),
    "out/api/search": '{"react":"search"}',
    "out/llms/react/components/button.txt": "archive LLM",
    "out/react/llms.txt": "archive index",
    "out/react/llms-full.txt": "archive full text",
    "out/404.html": "not found",
  }))
    await write(name, content);
  return { dir, write };
}

it("exports a self-contained React archive with old CLI URL compatibility", async () => {
  const { dir } = await fixture();
  const output = await exportArchive({
    docsDirectory: dir,
    channel: "react/v2",
    sourceSha: "a".repeat(40),
    sourceDirty: true,
  });
  const read = (name: string) => readFile(path.join(output, name), "utf8");
  expect(await read("react/v2/index.html")).toBe("archive page");
  expect(await read("react/v2/_assets/_next/static/chunk.js")).toBe("archive chunk");
  expect(await read("react/v2/_examples/blocks/footer-01/index.html")).toBe("block example");
  expect(await read("react/v2/sitemap.xml")).toBe(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://seed-design.io/react/v2/</loc></url><url><loc>https://seed-design.io/react/v2/components/button/</loc></url></urlset>\n',
  );
  expect(await read("react/v2/__registry__/react/ui/button.json")).toBe('{"id":"ui/button"}');
  expect(await read("react/v2/api/search")).toBe('{"react":"search"}');
  expect(JSON.parse(await read("react/v2/__docs__/index.json"))).toEqual({
    categories: [{ id: "react", sections: [{ items: [{ docUrl: "/react/components/button" }] }] }],
  });
  expect(await read("_redirects")).toBe(
    "/react/v2/old /react/v2/new 301\n/react/v2/react/* /react/v2/:splat 302\n",
  );
  expect(JSON.parse(await read("react/v2/_assets/site.webmanifest"))).toEqual({
    icons: [{ src: "/react/v2/_assets/logo.svg" }],
    start_url: "/react/v2/",
    scope: "/react/v2/",
  });
  expect(JSON.parse(await read("react/v2/archive.json"))).toEqual({
    platform: "react",
    version: "v2",
    prefix: "/react/v2",
    sourceSha: "a".repeat(40),
    sourceDirty: true,
  });
  expect(await read("_headers")).toBe(
    "/react/v2/_assets/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n/react/v2/__registry__/*\n  Access-Control-Allow-Origin: *\n",
  );
  expect(await Bun.file(path.join(output, "react/2.0/index.html")).exists()).toBe(false);
  expect(await Bun.file(path.join(output, "react/v2/_assets/react/v2/index.html")).exists()).toBe(
    false,
  );
  expect(await read("404.html")).toBe("not found");
  expect(
    Bun.file(path.join(output, "react/v2/__registry__/lynx/ui/button.json")).exists(),
  ).resolves.toBe(false);
});

it("keeps the previous artifact if a latest build was supplied by mistake", async () => {
  const { dir, write } = await fixture();
  await write("out-archive/react/v2/index.html", "previous valid build");
  await rm(path.join(dir, "out/react/v2"), { recursive: true });
  await expect(
    exportArchive({ docsDirectory: dir, channel: "react/v2", sourceSha: "a".repeat(40) }),
  ).rejects.toThrow();
  expect(await readFile(path.join(dir, "out-archive/react/v2/index.html"), "utf8")).toBe(
    "previous valid build",
  );
});

it("reuses the exporter for a later React major without including v2 pages", async () => {
  const { dir, write } = await fixture();
  await write("out/react/v3/index.html", "v3 page");
  const output = await exportArchive({
    docsDirectory: dir,
    channel: "react/v3",
    sourceSha: "b".repeat(40),
  });
  const read = (name: string) => readFile(path.join(output, name), "utf8");
  expect(await read("react/v3/index.html")).toBe("v3 page");
  expect(JSON.parse(await read("react/v3/archive.json"))).toEqual({
    platform: "react",
    version: "v3",
    prefix: "/react/v3",
    sourceSha: "b".repeat(40),
    sourceDirty: false,
  });
  expect(await read("react/v3/sitemap.xml")).toBe(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://seed-design.io/react/v3/</loc></url></urlset>\n',
  );
  expect(await read("_redirects")).toBe(
    "/react/v3/old /react/v3/new 301\n/react/v3/react/* /react/v3/:splat 302\n",
  );
  expect(await Bun.file(path.join(output, "react/v2/index.html")).exists()).toBe(false);
});

it("exports a self-contained Lynx archive with its example bundles and redirects", async () => {
  const { dir, write } = await fixture();
  for (const [name, content] of Object.entries({
    "out/lynx/v0/index.html": "lynx archive page",
    "out/lynx/v0/components/action-button/index.html": "lynx action button",
    "public/__lynx__/manifest.json": '{"schemaVersion":1,"examples":{}}',
    "public/__lynx__/web-core.css": "lynx-view {}",
    "public/__lynx__/badge/preview.12345678.lynx.bundle": "native bundle",
    "out/__registry__/lynx/ui/app-bar.json": '{"id":"ui/app-bar"}',
    "out/llms/lynx/components/action-button.txt": "lynx LLM",
    "out/lynx/llms.txt": "lynx index",
    "out/lynx/llms-full.txt": "lynx full text",
    "out/__docs__/index.json": JSON.stringify({
      categories: [
        { id: "react", sections: [] },
        { id: "lynx", sections: [{ items: [{ docUrl: "/lynx/components/action-button" }] }] },
      ],
    }),
    "public/_redirects":
      "/react/old /react/new 301\n/lynx/old /lynx/new 301\n/llms/lynx/old /llms/lynx/new 301\n",
  }))
    await write(name, content);
  const output = await exportArchive({
    docsDirectory: dir,
    channel: "lynx/v0",
    sourceSha: "c".repeat(40),
  });
  const read = (name: string) => readFile(path.join(output, name), "utf8");
  expect(await read("lynx/v0/components/action-button/index.html")).toBe("lynx action button");
  expect(await read("lynx/v0/_assets/_next/static/chunk.js")).toBe("archive chunk");
  expect(await read("lynx/v0/_assets/__lynx__/web-core.css")).toBe("lynx-view {}");
  expect(await read("lynx/v0/_assets/__lynx__/badge/preview.12345678.lynx.bundle")).toBe(
    "native bundle",
  );
  expect(await read("lynx/v0/__registry__/lynx/ui/app-bar.json")).toBe('{"id":"ui/app-bar"}');
  expect(await read("lynx/v0/llms/lynx/components/action-button.txt")).toBe("lynx LLM");
  expect(await read("lynx/v0/llms.txt")).toBe("lynx index");
  expect(await read("lynx/v0/llms-full.txt")).toBe("lynx full text");
  expect(JSON.parse(await read("lynx/v0/__docs__/index.json"))).toEqual({
    categories: [
      { id: "lynx", sections: [{ items: [{ docUrl: "/lynx/components/action-button" }] }] },
    ],
  });
  expect(await read("_redirects")).toBe(
    "/lynx/v0/old /lynx/v0/new 301\n/lynx/v0/llms/lynx/old /lynx/v0/llms/lynx/new 301\n/lynx/v0/lynx/* /lynx/v0/:splat 302\n",
  );
  expect(await read("_headers")).toBe(
    "/lynx/v0/_assets/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n/lynx/v0/__registry__/*\n  Access-Control-Allow-Origin: *\n",
  );
  expect(JSON.parse(await read("lynx/v0/archive.json"))).toEqual({
    platform: "lynx",
    version: "v0",
    prefix: "/lynx/v0",
    sourceSha: "c".repeat(40),
    sourceDirty: false,
  });
  for (const name of [
    "lynx/v0/_examples",
    "lynx/v0/__registry__/react",
    "lynx/v0/llms/react",
    "react/v2/index.html",
  ]) {
    expect(await Bun.file(path.join(output, name)).exists()).toBe(false);
  }
});

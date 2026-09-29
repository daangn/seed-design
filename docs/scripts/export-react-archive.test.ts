import { afterEach, expect, it } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { exportReactArchive } from "./export-react-archive";

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
  const output = await exportReactArchive({
    docsDirectory: dir,
    version: "v2",
    sourceSha: "a".repeat(40),
    sourceDirty: true,
  });
  const read = (name: string) => readFile(path.join(output, name), "utf8");
  expect(await read("react/v2/index.html")).toBe("archive page");
  expect(await read("react/v2/_assets/_next/static/chunk.js")).toBe("archive chunk");
  expect(await read("react/v2/_examples/blocks/footer-01/index.html")).toBe("block example");
  expect(await read("react/v2/sitemap.xml")).toContain(
    "<loc>https://seed-design.io/react/v2/components/button/</loc>",
  );
  expect(await read("react/v2/sitemap.xml")).not.toContain("_examples");
  expect(await read("react/v2/__registry__/react/ui/button.json")).toContain("ui/button");
  expect(await read("react/v2/api/search")).toContain("search");
  expect(JSON.parse(await read("react/v2/__docs__/index.json"))).toEqual({
    categories: [{ id: "react", sections: [{ items: [{ docUrl: "/react/components/button" }] }] }],
  });
  expect(await read("_redirects")).toBe(
    "/react/v2/old /react/v2/new 301\n/react/v2/react/* /react/v2/:splat 302\n",
  );
  expect(JSON.parse(await read("react/v2/_assets/site.webmanifest")).icons[0].src).toBe(
    "/react/v2/_assets/logo.svg",
  );
  expect(JSON.parse(await read("react/v2/archive.json")).sourceDirty).toBe(true);
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
    exportReactArchive({ docsDirectory: dir, version: "v2", sourceSha: "a".repeat(40) }),
  ).rejects.toThrow();
  expect(await readFile(path.join(dir, "out-archive/react/v2/index.html"), "utf8")).toBe(
    "previous valid build",
  );
});

it("reuses the exporter for a later React major without including v2 pages", async () => {
  const { dir, write } = await fixture();
  await write("out/react/v3/index.html", "v3 page");
  const output = await exportReactArchive({
    docsDirectory: dir,
    version: "v3",
    sourceSha: "b".repeat(40),
  });
  const read = (name: string) => readFile(path.join(output, name), "utf8");
  expect(await read("react/v3/index.html")).toBe("v3 page");
  expect(JSON.parse(await read("react/v3/archive.json"))).toMatchObject({
    platform: "react",
    version: "v3",
    prefix: "/react/v3",
  });
  expect(await read("react/v3/sitemap.xml")).toContain("https://seed-design.io/react/v3/");
  expect(await read("_redirects")).toContain("/react/v3/react/* /react/v3/:splat 302");
  expect(await Bun.file(path.join(output, "react/v2/index.html")).exists()).toBe(false);
});

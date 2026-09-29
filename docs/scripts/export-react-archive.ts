import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DocsIndex } from "../../packages/cli/src/schema";
import { createArchivePaths } from "../lib/docs-archive";

export async function exportReactArchive({
  docsDirectory,
  version,
  sourceSha,
  sourceDirty = false,
}: {
  docsDirectory: string;
  version: string;
  sourceSha: string;
  sourceDirty?: boolean;
}) {
  const paths = createArchivePaths(version);
  if (!paths.prefix || !/^[a-f0-9]{40}$/.test(sourceSha))
    throw new Error("Archive version and full source SHA are required");
  const input = path.join(docsDirectory, "out");
  const output = path.join(docsDirectory, "out-archive");
  const staging = `${output}.tmp-${crypto.randomUUID()}`;
  const archive = path.join(staging, paths.prefix);
  const copy = async (from: string, to: string) => {
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true, errorOnExist: true, force: false });
  };
  const pageUrls = async (directory: string, segments: string[] = []): Promise<string[]> => {
    const urls: string[] = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        urls.push(...(await pageUrls(path.join(directory, entry.name), [...segments, entry.name])));
      } else if (entry.name === "index.html") {
        urls.push(
          `https://seed-design.io${paths.prefix}/${segments.map(encodeURIComponent).join("/")}${segments.length ? "/" : ""}`,
        );
      }
    }
    return urls;
  };

  try {
    await copy(path.join(input, paths.prefix), archive);
    // Fail before replacing an existing artifact if this was a latest or incomplete build.
    await readFile(path.join(archive, "index.html"));
    const urls = await pageUrls(path.join(input, paths.prefix));
    await writeFile(
      path.join(archive, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
        .sort()
        .map((url) => `<url><loc>${url}</loc></url>`)
        .join("")}</urlset>\n`,
    );
    await copy(path.join(input, "_next"), path.join(archive, "_assets/_next"));
    await copy(path.join(input, "blocks"), path.join(archive, "_examples/blocks"));
    for (const entry of await readdir(path.join(docsDirectory, "public"))) {
      if (["_headers", "_redirects", "__registry__", "__docs__", "__lynx__"].includes(entry))
        continue;
      await copy(path.join(docsDirectory, "public", entry), path.join(archive, "_assets", entry));
    }
    const manifestPath = path.join(archive, "_assets/site.webmanifest");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    for (const icon of manifest.icons ?? []) icon.src = paths.asset(icon.src);
    manifest.start_url = `${paths.prefix}/`;
    manifest.scope = `${paths.prefix}/`;
    await writeFile(manifestPath, JSON.stringify(manifest));
    await copy(path.join(input, "__registry__/react"), path.join(archive, "__registry__/react"));
    await copy(path.join(input, "api/search"), path.join(archive, "api/search"));
    await copy(path.join(input, "llms/react"), path.join(archive, "llms/react"));
    for (const name of ["llms.txt", "llms-full.txt"]) {
      await copy(path.join(input, "react", name), path.join(archive, name));
    }
    const index: DocsIndex = JSON.parse(
      await readFile(path.join(input, "__docs__/index.json"), "utf8"),
    );
    index.categories = index.categories.filter((category) => category.id === "react");
    if (index.categories.length !== 1) throw new Error("React docs index is missing");
    // The existing CLI concatenates baseUrl + /llms + docUrl. Preserve its /react/... contract.
    await mkdir(path.join(archive, "__docs__"), { recursive: true });
    await writeFile(path.join(archive, "__docs__/index.json"), JSON.stringify(index));
    await copy(path.join(input, "404.html"), path.join(staging, "404.html"));

    // Backport the release branch's redirects, never the newer major's replacements.
    const redirects = (await readFile(path.join(docsDirectory, "public/_redirects"), "utf8"))
      .split("\n")
      .filter((line) => /^\/react(?:\/|\s)/.test(line))
      .map((line) => {
        const [from, to, status] = line.trim().split(/\s+/);
        return `${paths.link(from)} ${paths.link(to)} ${status}`;
      });
    // Older CLIs also print baseUrl + docUrl. Redirect that extra /react segment to the page.
    redirects.push(`${paths.prefix}/react/* ${paths.prefix}/:splat 302`);
    await writeFile(path.join(staging, "_redirects"), `${redirects.join("\n")}\n`);
    await writeFile(
      path.join(staging, "_headers"),
      `${paths.prefix}/_assets/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n${paths.prefix}/__registry__/*\n  Access-Control-Allow-Origin: *\n`,
    );
    await writeFile(
      path.join(archive, "archive.json"),
      JSON.stringify(
        { platform: "react", version, prefix: paths.prefix, sourceSha, sourceDirty },
        null,
        2,
      ),
    );
    await rm(output, { recursive: true, force: true });
    await rename(staging, output);
    return output;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

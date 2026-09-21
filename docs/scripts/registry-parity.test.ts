import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { getDocUrl, getLLMMarkdownUrl, sectionConfigs, sections } from "../app/_llms/config";

const docsRoot = path.resolve(import.meta.dir, "..");
const repoRoot = path.resolve(docsRoot, "..");
const contentRoot = path.join(docsRoot, "content");

/** Every routable page, as the section it sits in and its slugs within that section. */
const servedPages = sections.flatMap((section) => {
  const sourceDir = path.join(contentRoot, sectionConfigs[section].contentDir);

  return listFiles(sourceDir, /\.mdx$/).map((file) => ({
    section,
    slugs: filePathToSlugs(path.relative(sourceDir, file)),
  }));
});

/** `/{section}/{...slugs}.md` — the document URL with `.md` behind it — for every routable page. */
const servedLlmsUrls = new Set(
  servedPages.map(({ section, slugs }) => getLLMMarkdownUrl(section, slugs)),
);

/** `/{section}/{...slugs}` for every routable page in the content tree. */
const servedDocUrls = new Set(servedPages.map(({ section, slugs }) => getDocUrl(section, slugs)));

/**
 * Convert a file path relative to its content dir into URL slugs.
 * Strips route groups (parenthesized dirs) and the .mdx extension.
 *
 * The section root `index.mdx` yields an empty array — it is a real page (the section
 * landing) that simply has no slug of its own.
 */
function filePathToSlugs(relPath: string): string[] {
  let clean = relPath.replace(/\.mdx$/, "").replace(/\([^)]+\)\//g, "");

  if (clean === "index") return [];
  if (clean.endsWith("/index")) {
    clean = clean.replace(/\/index$/, "");
  }

  return clean.split("/").filter(Boolean);
}

/** Every file under `dir` whose name matches `pattern`, recursively. */
function listFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listFiles(full, pattern);
    return pattern.test(entry) ? [full] : [];
  });
}

describe("section registry ↔ routes", () => {
  // Which sections that route can answer for is settled by `sectionSources`, whose
  // `Record<Section, ...>` the compiler holds to the registry. What no type can see is
  // whether the file carrying it still exists — without it every page 404s at once.
  it("serves every section from one markdown route", () => {
    expect(existsSync(path.join(docsRoot, "app/[...slug]/route.ts"))).toBe(true);
  });

  it("every content dir is registered as a section", () => {
    const contentDirs = readdirSync(contentRoot).filter((entry) =>
      statSync(path.join(contentRoot, entry)).isDirectory(),
    );
    const registered = sections.map((section) => sectionConfigs[section].contentDir);

    expect(contentDirs.filter((dir) => !registered.includes(dir))).toEqual([]);
  });
});

describe("skills reference live docs URLs", () => {
  const skillUrls = (() => {
    const found = new Set<string>();
    for (const file of listFiles(path.join(repoRoot, "skills"), /\.(md|mdx)$/)) {
      for (const match of readFileSync(file, "utf-8").matchAll(
        /https:\/\/seed-design\.io(\/[a-z0-9/._-]*\.md)/g,
      )) {
        found.add(match[1]);
      }
    }
    return [...found].sort();
  })();

  it("resolves every referenced markdown URL", () => {
    expect(skillUrls.filter((url) => !servedLlmsUrls.has(url))).toEqual([]);
  });
});

/**
 * The URLs `packages/cli/src` and `packages/docs-mcp/src` hand to users were read by no
 * test: the skills block above walks `skills/` alone. That is how a link to the IA the
 * site had already left behind survived a release.
 */
const packageSourceRoots = ["packages/cli/src", "packages/docs-mcp/src"].map((rel) =>
  path.join(repoRoot, rel),
);

describe("CLI and docs-mcp reference live docs pages", () => {
  // Paths the site serves as data rather than as a page. They have no entry in the content
  // tree, so measuring them against it would reject every one.
  const dataPrefixes = ["/__registry__/", "/__docs__/", "/rootage/", "/schemas/", "/icons/"];

  // A bare origin yields an empty path, and `/` is the site root — neither names a page.
  const isPagePath = (url: string) =>
    url.startsWith("/") && url !== "/" && !dataPrefixes.some((prefix) => url.startsWith(prefix));

  // docs-mcp joins its paths onto a constant now that the origin is overridable, so the
  // literal origin no longer sits next to the path and the second pattern is what sees it.
  const originPatterns = [
    /https:\/\/seed-design\.io(\/[a-zA-Z0-9/._-]*)/g,
    /\$\{SEED_DOCS_BASE_URL\}(\/[a-zA-Z0-9/._-]*)/g,
  ];

  /** Referenced pathname → the file it was written in, for a legible failure. */
  const referenced = (() => {
    const found = new Map<string, string>();
    for (const root of packageSourceRoots) {
      for (const file of listFiles(root, /\.tsx?$/)) {
        const source = readFileSync(file, "utf-8");
        for (const pattern of originPatterns) {
          for (const match of source.matchAll(pattern)) {
            found.set(match[1], path.relative(repoRoot, file));
          }
        }
      }
    }
    return found;
  })();

  it("resolves every referenced docs page", () => {
    const pages = [...referenced].filter(([url]) => isPagePath(url));

    // 페이지 URL을 하나도 못 찾으면 아래 단언은 통과해도 아무것도 보지 않는다.
    expect(pages.length).toBeGreaterThan(0);
    expect(
      pages
        .filter(([url]) => !servedDocUrls.has(url) && !servedLlmsUrls.has(url))
        .map(([url, file]) => `${file}: ${url}`),
    ).toEqual([]);
  });
});

describe("no shipped file points at the parked domain", () => {
  // seed-design.com is a third party's parking page. The project owns seed-design.io only.
  it("never writes seed-design.com", () => {
    const roots = [...packageSourceRoots, path.join(repoRoot, "skills")];
    const offenders = roots.flatMap((root) =>
      listFiles(root, /\.(tsx?|mdx?|json)$/)
        .filter((file) => readFileSync(file, "utf-8").includes("seed-design.com"))
        .map((file) => path.relative(repoRoot, file)),
    );

    expect(offenders).toEqual([]);
  });
});

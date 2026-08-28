import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  type Section,
  getDocUrl,
  getLLMMarkdownUrl,
  sectionConfigs,
  sections,
} from "../app/_llms/config";
import { filePathToSlugs, listSectionPages } from "./content-pages";
import { sections as fullTextSections } from "./generate-llms-full";
import type { DocsIndex } from "../../packages/cli/src/schema";

const docsRoot = path.resolve(import.meta.dir, "..");
const repoRoot = path.resolve(docsRoot, "..");
const contentRoot = path.join(docsRoot, "content");

const docsIndex = JSON.parse(
  readFileSync(path.join(docsRoot, "public/__docs__/index.json"), "utf-8"),
) as DocsIndex;

/** `/llms/{section}/{...slugs}.txt` for every routable page in the content tree. */
const servedLlmsUrls = new Set(
  sections.flatMap((section) =>
    listSectionPages(section, contentRoot).map(({ slugs }) => getLLMMarkdownUrl(section, slugs)),
  ),
);

/** `/{section}/{...slugs}` for every routable page in the content tree. */
const servedDocUrls = new Set(
  sections.flatMap((section) =>
    listSectionPages(section, contentRoot).map(({ slugs }) => getDocUrl(section, slugs)),
  ),
);

/** Every file under `dir` whose name matches `pattern`, recursively. */
function listFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listFiles(full, pattern);
    return pattern.test(entry) ? [full] : [];
  });
}

describe("section registry ↔ routes", () => {
  it.each(sections)("%s has a section llms.txt route", (section) => {
    expect(existsSync(path.join(docsRoot, "app", section, "llms.txt/route.ts"))).toBe(true);
  });

  // llms-full.txt is written at build time by scripts/generate-llms-full.ts, so a section
  // declaring fullText without being in that script's list advertises a file nobody emits.
  it.each(sections)("%s declares fullText to match the llms-full generator", (section) => {
    const generated = (fullTextSections as readonly string[]).includes(section);
    expect(generated).toBe(sectionConfigs[section].fullText);
  });

  // `getLLMMarkdownUrl` derives every page's llmsUrl from the registry alone, so a section
  // whose route file is missing publishes a 404 for each of its pages.
  it.each(sections)("%s has a per-page llms route", (section) => {
    expect(existsSync(path.join(docsRoot, "app/llms", section, "[...slug]/route.ts"))).toBe(true);
  });

  it("every content dir is registered as a section", () => {
    const contentDirs = readdirSync(contentRoot).filter((entry) =>
      statSync(path.join(contentRoot, entry)).isDirectory(),
    );
    const registered = sections.map((section) => sectionConfigs[section].contentDir);

    expect(contentDirs.filter((dir) => !registered.includes(dir))).toEqual([]);
  });
});

describe("docs index ↔ content", () => {
  it("holds every routable page exactly once", () => {
    const indexed = docsIndex.categories
      .flatMap((c) => c.sections.flatMap((s) => s.items.map((i) => i.docUrl)))
      .sort();

    // Pages without a frontmatter title are skipped by the generator, so the index is a
    // subset — but it must never contain a docUrl the content tree cannot serve.
    expect(indexed.filter((url) => !servedDocUrls.has(url))).toEqual([]);
    expect(indexed.length).toBeGreaterThan(200);
  });

  const allItems = docsIndex.categories.flatMap((c) => c.sections.flatMap((s) => s.items));

  it("points every item at a served llms.txt URL", () => {
    expect(allItems.filter((item) => !item.llmsUrl || !servedLlmsUrls.has(item.llmsUrl))).toEqual(
      [],
    );
  });

  // 제외 목록을 레지스트리에서 끌어온다. 특정 페이지 id를 박아 두면 그 페이지가 사라지는
  // 날 생성기가 멀쩡해도 테스트가 깨진다.
  it("excludes paths the registry opted out of", () => {
    const excluded = sections.flatMap((section) =>
      sectionConfigs[section].excludePaths.map((relPath) =>
        getDocUrl(section, filePathToSlugs(relPath)),
      ),
    );

    // 제외 목록이 비면 아래 단언은 통과해도 아무것도 보지 않는다.
    expect(excluded.length).toBeGreaterThan(0);
    expect(allItems.map((item) => item.docUrl).filter((url) => excluded.includes(url))).toEqual([]);
  });
});

describe("skills reference live docs URLs", () => {
  const skillUrls = (() => {
    const found = new Set<string>();
    for (const file of listFiles(path.join(repoRoot, "skills"), /\.(md|mdx)$/)) {
      for (const match of readFileSync(file, "utf-8").matchAll(
        /https:\/\/seed-design\.io(\/llms\/[a-z0-9/._-]*\.txt)/g,
      )) {
        found.add(match[1]);
      }
    }
    return [...found].sort();
  })();

  it("resolves every referenced llms.txt URL", () => {
    // The changelog routes are generated per package/version, not from the content tree.
    const checkable = skillUrls.filter((url) => !url.startsWith("/llms/react/updates/changelog"));

    expect(checkable.filter((url) => !servedLlmsUrls.has(url))).toEqual([]);
  });
});

describe("CLI query resolution invariants", () => {
  const categoryIds = docsIndex.categories.map((c) => c.id);

  it("keeps category ids aligned with registry sections", () => {
    expect(categoryIds.filter((id) => !sections.includes(id as Section))).toEqual([]);
  });

  // 같은 id가 카테고리 여러 곳에 실린다(디자인 스펙과 그 React 구현). CLI가 둘을 구별하는
  // 근거는 각 항목이 자기 카테고리의 baseUrl 아래 있다는 것뿐이라, 그 관계가 깨지면
  // `components/x`와 `react/components/x`가 같은 곳을 가리키게 된다. 어느 컴포넌트가
  // 그런지는 문서가 늘고 줄면 바뀌므로 이름을 박지 않는다.
  it("keeps every item under its own category's base URL", () => {
    const misplaced = docsIndex.categories.flatMap((category) => {
      const { baseUrl } = sectionConfigs[category.id as Section];

      return category.sections
        .flatMap((s) => s.items)
        .filter((item) => item.docUrl !== baseUrl && !item.docUrl.startsWith(`${baseUrl}/`))
        .map((item) => `${category.id}: ${item.docUrl}`);
    });

    expect(misplaced).toEqual([]);
  });

  it("has at least one id that two categories both carry", () => {
    const idsPerCategory = docsIndex.categories.map(
      (category) => new Set(category.sections.flatMap((s) => s.items).map((i) => i.id)),
    );
    const shared = idsPerCategory.flatMap((ids, index) =>
      [...ids].filter((id) => idsPerCategory.some((other, i) => i !== index && other.has(id))),
    );

    expect(shared.length).toBeGreaterThan(0);
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
  const dataPrefixes = [
    "/llms/",
    "/__registry__/",
    "/__docs__/",
    "/rootage/",
    "/schemas/",
    "/icons/",
  ];

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
      pages.filter(([url]) => !servedDocUrls.has(url)).map(([url, file]) => `${file}: ${url}`),
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

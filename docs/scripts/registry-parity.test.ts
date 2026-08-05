import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { type Section, sectionConfigs, sections } from "../app/_llms/config";
import { listSectionPages } from "./content-pages";
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
    listSectionPages(section, contentRoot).map(
      ({ slugs }) => `/llms/${section}/${slugs.join("/")}.txt`,
    ),
  ),
);

describe("section registry ↔ routes", () => {
  it.each(sections)("%s has a section llms.txt route", (section) => {
    expect(existsSync(path.join(docsRoot, "app", section, "llms.txt/route.ts"))).toBe(true);
  });

  it.each(sections)("%s declares fullText to match its llms-full.txt route", (section) => {
    const hasRoute = existsSync(path.join(docsRoot, "app", section, "llms-full.txt/route.ts"));
    expect(hasRoute).toBe(sectionConfigs[section].fullText);
  });

  // An already-published CLI builds llms links as `${baseUrl}/llms${docUrl}.txt`, so a
  // category without this route hands every installed copy a 404.
  it.each(
    docsIndex.categories.map((c) => c.id),
  )("%s is a docs index category and has a per-page llms route", (categoryId) => {
    expect(existsSync(path.join(docsRoot, "app/llms", categoryId, "[...slug]/route.ts"))).toBe(
      true,
    );
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
    const expected = sections
      .flatMap((section) =>
        listSectionPages(section, contentRoot).map(
          ({ slugs }) => `${sectionConfigs[section].baseUrl}/${slugs.join("/")}`,
        ),
      )
      .sort();
    const indexed = docsIndex.categories
      .flatMap((c) => c.sections.flatMap((s) => s.items.map((i) => i.docUrl)))
      .sort();

    // Pages without a frontmatter title are skipped by the generator, so the index is a
    // subset — but it must never contain a docUrl the content tree cannot serve.
    expect(indexed.filter((url) => !expected.includes(url))).toEqual([]);
    expect(indexed.length).toBeGreaterThan(200);
  });

  it("points every item at a served llms.txt URL", () => {
    const dangling = docsIndex.categories
      .flatMap((c) => c.sections.flatMap((s) => s.items.map((i) => i.docUrl)))
      .map((docUrl) => `/llms${docUrl}.txt`)
      .filter((url) => !servedLlmsUrls.has(url));

    expect(dangling).toEqual([]);
  });

  it("excludes paths the registry opted out of", () => {
    const ids = docsIndex.categories.flatMap((c) =>
      c.sections.flatMap((s) => s.items.map((i) => i.id)),
    );

    expect(ids).not.toContain("progress-board");
  });
});

describe("skills reference live docs URLs", () => {
  const skillUrls = (() => {
    const found = new Set<string>();
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(md|mdx)$/.test(entry)) continue;
        for (const match of readFileSync(full, "utf-8").matchAll(
          /https:\/\/seed-design\.io(\/llms\/[a-z0-9/._-]*\.txt)/g,
        )) {
          found.add(match[1]);
        }
      }
    };
    walk(path.join(repoRoot, "skills"));
    return [...found].sort();
  })();

  it("finds llms URLs to check", () => {
    expect(skillUrls.length).toBeGreaterThan(10);
  });

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

  it("resolves components/action-button to the design spec, not React", () => {
    const design = docsIndex.categories
      .find((c) => c.id === "components")
      ?.sections.flatMap((s) => s.items)
      .find((i) => i.id === "action-button");

    expect(design?.docUrl).toBe("/components/action-button");
  });

  it("keeps react/components/action-button reachable", () => {
    const react = docsIndex.categories
      .find((c) => c.id === "react")
      ?.sections.find((s) => s.id === "components")
      ?.items.find((i) => i.id === "action-button");

    expect(react?.docUrl).toBe("/react/components/action-button");
  });
});

import {
  getAiIntegrationSource,
  getBreezeSource,
  getComponentsSource,
  getDocsSource,
  getFoundationsSource,
  getGetStartedSource,
  getLynxSource,
  getPatternsSource,
  getReactSource,
  getUpdatesSource,
} from "@/app/source";
import type { MarkdownRenderer } from "@fumadocs/satteri/local-md";
import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { findPath, type Root } from "fumadocs-core/page-tree";
import { koreanTokenizer } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";
import { getEntrySearchText } from "@/lib/changelog-entry";
import { getChangelogHref } from "@/components/changelog-viewer/utils";
import { sectionLabel } from "@/lib/docs-sections";
import { parseChangelog } from "@/lib/parse-changelog";

// it should be cached forever
export const revalidate = false;

type IndexableSource = {
  pageTree: Root;
  getPages: () => {
    url: string;
    data: {
      title: string;
      description?: string;
      load: () => Promise<MarkdownRenderer<Record<string, unknown>>>;
    };
  }[];
};

/**
 * Where the page sits, worded as the sidebar words it: the header section it belongs to, then
 * the folders above it. `searchAdvanced` carries this onto the document's `page` row, and the
 * dialog prints it over the title — so a result says which part of the docs it came from
 * without the reader having to recognise the title.
 *
 * A tree node's name is a `ReactNode`, so only the ones authored as plain text can be read
 * back out; the rest are dropped rather than rendered as `[object Object]`.
 */
function buildBreadcrumbs(tree: Root, url: string) {
  const path = findPath(tree.children, (node) => node.type === "page" && node.url === url) ?? [];
  const trail = [
    sectionLabel(url),
    // `findPath` ends at the page itself, which the row's own title already says.
    ...path.slice(0, -1).map(({ name }) => (typeof name === "string" ? name : "")),
  ].filter(Boolean);

  // A section whose tree opens with a folder of the same name — `/components` under
  // "Components" — would otherwise say it twice before naming anything.
  return trail.filter((crumb, index) => crumb !== trail[index - 1]);
}

/** Map a docs source's pages into search indexes under a single tag. */
async function indexSource(source: IndexableSource, tag: string): Promise<AdvancedIndex[]> {
  return Promise.all(
    source.getPages().map(async (page) => {
      const { structuredData } = await page.data.load();
      return {
        id: page.url,
        title: page.data.title,
        description: page.data.description,
        structuredData,
        breadcrumbs: buildBreadcrumbs(source.pageTree, page.url),
        tag,
        url: page.url,
      } satisfies AdvancedIndex;
    }),
  );
}

async function getChangelogIndexes(): Promise<AdvancedIndex[]> {
  const entries = await parseChangelog(process.cwd());

  const byPackage = new Map<string, Map<string, string[]>>();
  for (const entry of entries) {
    if (!byPackage.has(entry.package.name)) byPackage.set(entry.package.name, new Map());
    const versions = byPackage.get(entry.package.name)!;
    const key = entry.package.version;
    if (!versions.has(key)) versions.set(key, []);
    versions.get(key)!.push(getEntrySearchText(entry));
  }

  return [...byPackage.entries()].flatMap(([packageName, versions]) => {
    const label = packageName.replace("@seed-design/", "");

    return [...versions.entries()].map(([version, items]) => {
      const versionUrl = getChangelogHref(packageName, version);

      return {
        id: versionUrl,
        title: `Changelog - ${label}@${version}`,
        description: `${packageName}@${version} 변경사항`,
        structuredData: {
          headings: [],
          contents: items.map((item) => ({ heading: "", content: item })),
        },
        // No page tree to walk — these are built from the packages' CHANGELOG files rather
        // than from a docs source — so the trail is spelled out instead of derived.
        breadcrumbs: [sectionLabel(versionUrl), "Changelog", label],
        tag: TAGS.react.value,
        url: versionUrl,
      };
    });
  });
}

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: async () => {
    const [
      docsSource,
      getStartedSource,
      breezeSource,
      foundationsSource,
      componentsSource,
      patternsSource,
      reactSource,
      lynxSource,
      aiIntegrationSource,
      updatesSource,
    ] = await Promise.all([
      getDocsSource(),
      getGetStartedSource(),
      getBreezeSource(),
      getFoundationsSource(),
      getComponentsSource(),
      getPatternsSource(),
      getReactSource(),
      getLynxSource(),
      getAiIntegrationSource(),
      getUpdatesSource(),
    ]);

    const groups = await Promise.all([
      // Sections without a filter chip (legacy /docs tree, get-started, breeze) keep
      // their own tag so they only surface under the "All" filter.
      indexSource(docsSource, "design"),
      indexSource(getStartedSource, "get-started"),
      indexSource(breezeSource, "breeze"),
      // Header sections — each maps to its own filter chip (see search/constants.ts).
      indexSource(foundationsSource, TAGS.foundations.value),
      indexSource(componentsSource, TAGS.components.value),
      indexSource(patternsSource, TAGS.patterns.value),
      indexSource(reactSource, TAGS.react.value),
      indexSource(lynxSource, TAGS.lynx.value),
      indexSource(aiIntegrationSource, TAGS.aiIntegration.value),
      indexSource(updatesSource, TAGS.updates.value),
      // Package changelogs live at /react/updates/changelog, so they answer to React like the
      // rest of that tree. The Updates chip stays the design system's own news at /updates.
      getChangelogIndexes(),
    ]);

    return groups.flat();
  },
  tokenizer: koreanTokenizer,
});

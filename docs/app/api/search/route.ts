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
import { koreanTokenizer } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";
import { getEntrySearchText } from "@/lib/changelog-entry";
import { getChangelogHref } from "@/components/changelog-viewer/utils";
import { parseChangelog } from "@/lib/parse-changelog";

// it should be cached forever
export const revalidate = false;

type IndexableSource = {
  getPages: () => {
    url: string;
    data: {
      title: string;
      description?: string;
      load: () => Promise<MarkdownRenderer<Record<string, unknown>>>;
    };
  }[];
};

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
        tag: TAGS.updates.value,
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
      // Package changelogs belong to Updates.
      getChangelogIndexes(),
    ]);

    return groups.flat();
  },
  tokenizer: koreanTokenizer,
});

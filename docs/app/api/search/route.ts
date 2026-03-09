import { breezeSource, reactSource, docsSource, lynxSource } from "@/app/source";
import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { tokenize } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";
import { parseChangelog } from "@/lib/parse-changelog";

// it should be cached forever
export const revalidate = false;

async function getChangelogIndexes(): Promise<AdvancedIndex[]> {
  const entries = await parseChangelog(process.cwd());

  const byPackage = new Map<string, Map<string, string[]>>();
  for (const entry of entries) {
    if (!byPackage.has(entry.package.name)) byPackage.set(entry.package.name, new Map());
    const versions = byPackage.get(entry.package.name)!;
    const key = entry.package.version;
    if (!versions.has(key)) versions.set(key, []);
    versions.get(key)!.push(entry.contentHtml.replace(/<[^>]*>/g, ""));
  }

  return [...byPackage.entries()].map(([packageName, versions]) => {
    const label = packageName.replace("@seed-design/", "");

    const headings = [...versions.keys()].map((version) => ({
      id: `${packageName}@${version}`,
      content: `${version}`,
    }));

    const contents = [...versions.entries()].flatMap(([version, items]) =>
      items.map((item) => ({
        heading: `${packageName}@${version}`,
        content: item,
      })),
    );

    const tabUrl = `/react/updates/changelog?tab=${encodeURIComponent(packageName)}`;

    return {
      id: tabUrl,
      title: `Changelog - ${label}`,
      description: `${packageName} 변경사항`,
      structuredData: { headings, contents },
      tag: TAGS.react.value,
      url: tabUrl,
    };
  });
}

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: async () => {
    const [docsPages, reactPages, breezePages, lynxPages, changelogIndexes] = await Promise.all([
      Promise.all(
        docsSource.getPages().map(async (page) => {
          const { structuredData } = await page.data.load();
          return {
            id: page.url,
            title: page.data.title,
            description: page.data.description,
            structuredData,
            tag: TAGS.design.value,
            url: page.url,
          } satisfies AdvancedIndex;
        }),
      ),
      Promise.all(
        reactSource.getPages().map(async (page) => {
          const { structuredData } = await page.data.load();
          return {
            id: page.url,
            title: page.data.title,
            description: page.data.description,
            structuredData,
            tag: TAGS.react.value,
            url: page.url,
          } satisfies AdvancedIndex;
        }),
      ),
      Promise.all(
        breezeSource.getPages().map(async (page) => {
          const { structuredData } = await page.data.load();
          return {
            id: page.url,
            title: page.data.title,
            description: page.data.description,
            structuredData,
            tag: TAGS.breeze.value,
            url: page.url,
          } satisfies AdvancedIndex;
        }),
      ),
      Promise.all(
        lynxSource.getPages().map(async (page) => {
          const { structuredData } = await page.data.load();
          return {
            id: page.url,
            title: page.data.title,
            description: page.data.description,
            structuredData,
            tag: TAGS.lynx.value,
            url: page.url,
          } satisfies AdvancedIndex;
        }),
      ),
      getChangelogIndexes(),
    ]);

    return [...docsPages, ...reactPages, ...breezePages, ...lynxPages, ...changelogIndexes];
  },
  tokenizer: {
    language: "english",
    tokenize,
  },
});

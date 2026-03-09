import { breezeSource, reactSource, docsSource, lynxSource } from "@/app/source";
import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { tokenize } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";
import { parseChangelog } from "@/lib/parse-changelog";

// it should be cached forever
export const revalidate = false;

async function getChangelogIndex(): Promise<AdvancedIndex> {
  const entries = await parseChangelog(process.cwd());

  const grouped = new Map<string, string[]>();
  for (const entry of entries) {
    const key = `${entry.package.name}@${entry.package.version}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(entry.content);
  }

  const headings = [...grouped.keys()].map((key) => ({
    id: key,
    content: key,
  }));

  const contents = [...grouped.entries()].flatMap(([key, items]) =>
    items.map((item) => ({
      heading: key,
      content: item,
    })),
  );

  return {
    id: "/react/updates/changelog",
    title: "Changelog",
    description: "최신 업데이트와 변경사항을 기록합니다.",
    structuredData: { headings, contents },
    tag: TAGS.react.value,
    url: "/react/updates/changelog",
  };
}

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: () =>
    Promise.all([
      ...docsSource.getPages().map(async (page) => {
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
      ...reactSource.getPages().map(async (page) => {
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
      ...breezeSource.getPages().map(async (page) => {
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
      ...lynxSource.getPages().map(async (page) => {
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
      getChangelogIndex(),
    ]),
  tokenizer: {
    language: "english",
    tokenize,
  },
});

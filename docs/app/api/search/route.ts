import { breezeSource, reactSource, docsSource, lynxSource } from "@/app/source";
import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { tokenize } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";

// it should be cached forever
export const revalidate = false;

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
    ]),
  tokenizer: {
    language: "english",
    tokenize,
  },
});

import { source } from "@/app/source";
import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { tokenize } from "@/components/search/tokenizer";

// it should be cached forever
export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: () =>
    Promise.all(
      source.getPages().map(async (page) => {
        const { structuredData } = await page.data.load();

        return {
          id: page.url,
          title: page.data.title,
          description: page.data.description,
          structuredData,
          tag: page.slugs[0],
          url: page.url,
        } satisfies AdvancedIndex;
      }),
    ),
  tokenizer: {
    language: "english",
    tokenize,
  },
});

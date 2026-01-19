import { AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { tokenize } from "@/components/search/tokenizer";
import { TAGS } from "@/app/api/search/constants";

// it should be cached forever
export const revalidate = false;

// Dynamic imports for search indexing (only runs at build time)
async function getAllSources() {
  const [{ getDocsSource }, { getReactSource }, { getBreezeSource }, { getLynxSource }] =
    await Promise.all([
      import("@/app/sources/docs-source"),
      import("@/app/sources/react-source"),
      import("@/app/sources/breeze-source"),
      import("@/app/sources/lynx-source"),
    ]);

  return Promise.all([getDocsSource(), getReactSource(), getBreezeSource(), getLynxSource()]);
}

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: async () => {
    const [source, reactSource, breezeSource, lynxSource] = await getAllSources();

    return Promise.all([
      ...source.getPages().map(async (page) => {
        const pageData = page.data;
        const structuredData = (
          "structuredData" in pageData
            ? pageData.structuredData
            : (await pageData.load()).structuredData
        ) as AdvancedIndex["structuredData"];

        return {
          id: page.url,
          title: page.data.title ?? "",
          description: page.data.description ?? "",
          structuredData,
          tag: TAGS.design.value,
          url: page.url,
        } satisfies AdvancedIndex;
      }),
      ...reactSource.getPages().map(async (page) => {
        const pageData = page.data;
        const structuredData = (
          "structuredData" in pageData
            ? pageData.structuredData
            : (await pageData.load()).structuredData
        ) as AdvancedIndex["structuredData"];

        return {
          id: page.url,
          title: page.data.title ?? "",
          description: page.data.description ?? "",
          structuredData,
          tag: TAGS.react.value,
          url: page.url,
        } satisfies AdvancedIndex;
      }),
      ...breezeSource.getPages().map(async (page) => {
        const pageData = page.data;
        const structuredData = (
          "structuredData" in pageData
            ? pageData.structuredData
            : (await pageData.load()).structuredData
        ) as AdvancedIndex["structuredData"];

        return {
          id: page.url,
          title: page.data.title ?? "",
          description: page.data.description ?? "",
          structuredData,
          tag: TAGS.breeze.value,
          url: page.url,
        } satisfies AdvancedIndex;
      }),
      ...lynxSource.getPages().map(async (page) => {
        const pageData = page.data;
        const structuredData = (
          "structuredData" in pageData
            ? pageData.structuredData
            : (await pageData.load()).structuredData
        ) as AdvancedIndex["structuredData"];

        return {
          id: page.url,
          title: page.data.title ?? "",
          description: page.data.description ?? "",
          structuredData,
          tag: TAGS.lynx.value,
          url: page.url,
        } satisfies AdvancedIndex;
      }),
    ]);
  },
  tokenizer: {
    language: "english",
    tokenize,
  },
});

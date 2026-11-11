import { metaLoader, pageLoader } from "@fumadocs/astro/loaders";
import { defineCollection } from "astro:content";
import { docsMetaSchema, pageSchemas } from "@/lib/content/schemas";

// 컬렉션 이름은 `lib/content/satteri-options.ts`의 `CONTENT_COLLECTIONS`와 같아야 한다.
// meta 컬렉션은 같은 이름에 `-meta`를 붙인다.
export const collections = {
  docs: defineCollection({ loader: pageLoader("docs"), schema: pageSchemas.docs }),
  "docs-meta": defineCollection({ loader: metaLoader("docs"), schema: docsMetaSchema }),
  "get-started": defineCollection({
    loader: pageLoader("get-started"),
    schema: pageSchemas["get-started"],
  }),
  "get-started-meta": defineCollection({
    loader: metaLoader("get-started"),
    schema: docsMetaSchema,
  }),
  foundations: defineCollection({
    loader: pageLoader("foundations"),
    schema: pageSchemas.foundations,
  }),
  "foundations-meta": defineCollection({
    loader: metaLoader("foundations"),
    schema: docsMetaSchema,
  }),
  components: defineCollection({
    loader: pageLoader("components"),
    schema: pageSchemas.components,
  }),
  "components-meta": defineCollection({
    loader: metaLoader("components"),
    schema: docsMetaSchema,
  }),
  patterns: defineCollection({ loader: pageLoader("patterns"), schema: pageSchemas.patterns }),
  "patterns-meta": defineCollection({ loader: metaLoader("patterns"), schema: docsMetaSchema }),
  react: defineCollection({ loader: pageLoader("react"), schema: pageSchemas.react }),
  "react-meta": defineCollection({ loader: metaLoader("react"), schema: docsMetaSchema }),
  breeze: defineCollection({ loader: pageLoader("breeze"), schema: pageSchemas.breeze }),
  "breeze-meta": defineCollection({ loader: metaLoader("breeze"), schema: docsMetaSchema }),
  lynx: defineCollection({ loader: pageLoader("lynx"), schema: pageSchemas.lynx }),
  "lynx-meta": defineCollection({ loader: metaLoader("lynx"), schema: docsMetaSchema }),
  "ai-integration": defineCollection({
    loader: pageLoader("ai-integration"),
    schema: pageSchemas["ai-integration"],
  }),
  "ai-integration-meta": defineCollection({
    loader: metaLoader("ai-integration"),
    schema: docsMetaSchema,
  }),
  updates: defineCollection({ loader: pageLoader("updates"), schema: pageSchemas.updates }),
  "updates-meta": defineCollection({ loader: metaLoader("updates"), schema: docsMetaSchema }),
};

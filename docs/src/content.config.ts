/**
 * Astro content collections. 섹션마다 page collection 하나, meta.json이 있는 섹션은 meta collection도 `SECTIONS`에서
 * 파생한다. 이름 규칙: page = `<id>`, meta = `<id>-meta`. 이 규칙을 아는 곳은 이 파일과 `src/content/source.ts`뿐이다.
 */
import { metaLoader, pageLoader } from "@fumadocs/astro/loaders";
import { defineCollection } from "astro:content";
import { docsMetaSchema, pageSchemas } from "../lib/content/schemas";
import { sectionsForBuild } from "./content/sections";

export const collections = Object.fromEntries(
  sectionsForBuild().flatMap((section) => [
    [
      section.id,
      defineCollection({ loader: pageLoader(section.id), schema: pageSchemas[section.id] }),
    ],
    ...(section.hasMeta
      ? [
          [
            `${section.id}-meta`,
            defineCollection({ loader: metaLoader(section.id), schema: docsMetaSchema }),
          ],
        ]
      : []),
  ]),
);

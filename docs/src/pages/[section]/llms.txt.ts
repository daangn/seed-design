/**
 * `/<section>/llms.txt`. 섹션 목록은 `SECTIONS`(`llms: true`)에서, 본문 모양은 `lib/llms/section-index.ts`에서 온다.
 * cacheKey를 두지 않아 incremental build에서도 매번 렌더링한다(섹션의 모든 페이지 메타데이터를 읽는다).
 */
import type { APIRoute } from "astro";
import { sectionLlmsIndex } from "../../../lib/llms/section-index";
import type { Section } from "../../../lib/llms/types";
import { type SectionId, sectionsForBuild } from "../../content/sections";
import { getLlmsPages } from "../../content/source";

export function getStaticPaths() {
  return sectionsForBuild()
    .filter((section) => section.llms)
    .map((section) => ({ params: { section: section.id }, props: { section: section.id } }));
}

export const GET: APIRoute = async ({ props }) => {
  const id = (props as { section: SectionId }).section;
  return new Response(await sectionLlmsIndex[id as Section](await getLlmsPages(id)), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};

/**
 * `/llms/<section>/<...slug>.txt`. 모든 llms 섹션(`SECTIONS`의 `llms`)의 인덱스가 아닌 페이지 하나씩이다.
 * 섹션 인덱스는 `/<section>/llms.txt`(`src/pages/[section]/llms.txt.ts`)가 대신한다.
 * cacheKey는 문서 route와 같다(본문 entry digest + 섹션 nav digest + Git 수정일).
 */
import type { APIRoute } from "astro";
import { getLLMText } from "../../../lib/llms/get-llm-text";
import type { Section } from "../../../lib/llms/types";
import { sectionsForBuild } from "../../content/sections";
import { type DocsPageRef, getLlmsPage, listSectionPages } from "../../content/source";

export async function getStaticPaths() {
  const sections = sectionsForBuild().filter((section) => section.llms);
  const paths = await Promise.all(sections.map((section) => listSectionPages(section.id)));
  return paths.flat().flatMap((path) => {
    const { section, slugs } = path.props;
    if (slugs.length === 0) return [];
    return [
      {
        params: { slug: `${section}/${slugs.join("/")}.txt` },
        props: path.props,
        cacheKey: path.cacheKey,
      },
    ];
  });
}

export const GET: APIRoute = async ({ props }) => {
  const ref = props as DocsPageRef;
  return new Response(await getLLMText(await getLlmsPage(ref), ref.section as Section), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};

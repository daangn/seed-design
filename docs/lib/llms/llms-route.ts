import type { APIRoute, GetStaticPaths } from "astro";
import { getLLMText } from "@/lib/llms/get-llm-text";
import type { LLMPage, Section } from "@/lib/llms/types";

/** The subset of a fumadocs source that a per-section llms.txt route consumes. */
interface LLMTextRouteSource {
  getPages(): LLMPage[];
}

/**
 * Build the `getStaticPaths` + `GET` exports for a section's
 * `/llms/<section>/<...slug>.txt` endpoint. Every section endpoint differs only by
 * (source, section), so they share this factory instead of copy-pasting the body.
 *
 * @example
 * // src/pages/llms/components/[...slug].txt.ts
 * export const { getStaticPaths, GET } = createLLMTextRoute(getComponentsSource, "components");
 */
export function createLLMTextRoute(getSource: () => Promise<LLMTextRouteSource>, section: Section) {
  const getStaticPaths = (async () => {
    const source = await getSource();
    return (
      source
        .getPages()
        // 섹션 인덱스는 `/<section>/llms.txt`가 대신한다.
        .filter((page) => page.slugs.length > 0)
        .map((page) => ({ params: { slug: page.slugs.join("/") }, props: { page } }))
    );
  }) satisfies GetStaticPaths;

  const GET: APIRoute<{ page: LLMPage }> = async ({ props }) =>
    new Response(await getLLMText(props.page, section), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });

  return { getStaticPaths, GET };
}

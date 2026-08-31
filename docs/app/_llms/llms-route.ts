import { getLLMText } from "@/app/_llms/get-llm-text";
import type { Section } from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { notFound } from "next/navigation";

/** The subset of a fumadocs source that a per-section llms.txt route consumes. */
interface LLMTextRouteSource {
  getPage(slugs: string[]): LLMPage | undefined;
  generateParams(): Array<{ slug?: string[] }>;
}

/**
 * Build the `GET` + `generateStaticParams` handlers for a section's
 * `/llms/<section>/<...slug>.txt` route. Every section route.ts differs only by
 * (source, section) — the trailing-`.txt` slug handling and markdown response are
 * identical — so they share this factory instead of copy-pasting the body.
 *
 * @example
 * // app/llms/components/[...slug]/route.ts
 * export const revalidate = false;
 * export const { GET, generateStaticParams } = createLLMTextRoute(componentsSource, "components");
 */
export function createLLMTextRoute(getSource: () => Promise<LLMTextRouteSource>, section: Section) {
  async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;

    const actualSlug = slug.map((s, i) => (i === slug.length - 1 ? s.replace(/\.txt$/, "") : s));

    const source = await getSource();
    // 섹션 루트 index.mdx는 slug가 없어 `getPage([])`로만 잡힌다. `index`를 그 자리에
    // 쓰는 건 fumadocs가 `index.mdx`를 부모로 접기 때문 — 형제 slug로는 절대 나타날 수 없다.
    const page =
      actualSlug.length === 1 && actualSlug[0] === "index"
        ? source.getPage([])
        : source.getPage(actualSlug);

    if (!page) notFound();

    return new Response(await getLLMText(page, section), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }

  async function generateStaticParams() {
    const source = await getSource();
    const withExt = (segments: string[]) => ({
      slug: segments.map((s, i) => (i === segments.length - 1 ? `${s}.txt` : s)),
    });

    return [
      ...(source.getPage([]) ? [withExt(["index"])] : []),
      ...source.generateParams().flatMap(({ slug }) => (slug?.length ? [withExt(slug)] : [])),
    ];
  }

  return { GET, generateStaticParams };
}

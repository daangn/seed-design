import { getLLMText } from "@/app/_llms/get-llm-text";
import type { LLMPage, Section } from "@/app/_llms/types";
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
export function createLLMTextRoute(source: LLMTextRouteSource, section: Section) {
  async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;

    const actualSlug = slug.map((s, i) => (i === slug.length - 1 ? s.replace(/\.txt$/, "") : s));

    const page = source.getPage(actualSlug);

    if (!page) notFound();

    return new Response(await getLLMText(page, section), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }

  function generateStaticParams() {
    return source
      .generateParams()
      .filter((p) => p.slug && p.slug.length > 0)
      .map((p) => ({
        slug: p.slug!.map((s, i) => (i === p.slug!.length - 1 ? `${s}.txt` : s)),
      }));
  }

  return { GET, generateStaticParams };
}

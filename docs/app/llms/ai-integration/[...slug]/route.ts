import { getLLMText } from "@/app/_llms/get-llm-text";
import type { LLMPage } from "@/app/_llms/types";
import { getAiIntegrationSource } from "@/app/sources/ai-integration-source";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const aiIntegrationSource = await getAiIntegrationSource();

  const actualSlug = slug.map((s, i) => (i === slug.length - 1 ? s.replace(/\.txt$/, "") : s));

  const page = aiIntegrationSource.getPage(actualSlug) as LLMPage | undefined;

  if (!page) notFound();

  return new Response(await getLLMText(page, "ai-integration"), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}

export async function generateStaticParams() {
  const aiIntegrationSource = await getAiIntegrationSource();
  return aiIntegrationSource
    .generateParams()
    .filter((p) => p.slug && p.slug.length > 0)
    .map((p) => ({
      slug: p.slug!.map((s, i) => (i === p.slug!.length - 1 ? `${s}.txt` : s)),
    }));
}

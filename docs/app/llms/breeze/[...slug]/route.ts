import { getLLMText } from "@/app/_llms/get-llm-text";
import { breezeSource } from "@/app/source";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;

  const actualSlug = slug.map((s, i) => (i === slug.length - 1 ? s.replace(/\.txt$/, "") : s));

  const page = breezeSource.getPage(actualSlug);

  if (!page) notFound();

  const allPages = breezeSource.getPages();

  return new Response(await getLLMText(page, "breeze", allPages), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export async function generateStaticParams() {
  return breezeSource
    .generateParams()
    .filter((p) => p.slug && p.slug.length > 0)
    .map((p) => ({
      slug: p.slug!.map((s, i) => (i === p.slug!.length - 1 ? `${s}.txt` : s)),
    }));
}

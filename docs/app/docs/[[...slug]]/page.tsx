import { source } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSanityGuide } from "./sanity-guide";
import { SanityGuidePreview } from "./sanity-preview";

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = source.getPage(params.slug ?? []);
  if (!page) notFound();

  const markdown = await page.data.load();
  const initialSanityData = await fetchSanityGuide(params.slug);

  const MDX = markdown.body;

  return (
    <SanityGuidePreview
      slug={params.slug}
      full={page.data.full}
      title={page.data.title}
      description={page.data.description}
      lastModified={markdown.lastModified}
      toc={markdown.toc}
      initialSanityData={initialSanityData}
    >
      <MDX components={mdxComponents} />
    </SanityGuidePreview>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}

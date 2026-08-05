import { getPageMarkdownUrl } from "@/app/_llms/config";
import { getBreezeSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { buildDocsPageJsonLd, buildDocsPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const breezeSource = await getBreezeSource();
  const page = breezeSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body, toc, lastModified } = await loadMarkdownPage(page);
  const markdownUrl = getPageMarkdownUrl("breeze", page);

  return (
    <DocsPageRenderer
      jsonLd={buildDocsPageJsonLd(page)}
      title={page.data.title}
      description={page.data.description}
      layout={page.data.frontmatter.layout}
      full={page.data.frontmatter.full}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      section="breeze"
      markdownUrl={markdownUrl}
    >
      {body}
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  const breezeSource = await getBreezeSource();
  return breezeSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const breezeSource = await getBreezeSource();
  const page = breezeSource.getPage(params.slug ?? []);
  if (!page) notFound();

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    description: page.data.description,
  });
}

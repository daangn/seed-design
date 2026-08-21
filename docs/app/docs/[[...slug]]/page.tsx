import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getDocsSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { getComponentStatus } from "@/lib/rootage";
import { buildDocsPageJsonLd, buildDocsPageMetadata, deprecatedTitle } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const docsSource = await getDocsSource();
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body, toc, lastModified } = await loadMarkdownPage(page);
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.frontmatter.deprecated,
  });

  const displayTitle = deprecatedTitle(page.data.title, deprecated);
  const markdownUrl = getLLMMarkdownUrl("docs", page.slugs);

  return (
    <DocsPageRenderer
      jsonLd={buildDocsPageJsonLd(page)}
      title={displayTitle}
      description={page.data.description}
      layout={page.data.frontmatter.layout}
      full={page.data.frontmatter.full}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      section="docs"
      markdownUrl={markdownUrl}
    >
      {body}
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  const docsSource = await getDocsSource();
  return docsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const docsSource = await getDocsSource();
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.frontmatter.deprecated,
  });

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    deprecated,
  });
}

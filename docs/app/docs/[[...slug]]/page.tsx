import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { docsSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/lib/rootage";
import { buildDocsPageMetadata, deprecatedTitle } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  const displayTitle = deprecatedTitle(page.data.title, deprecated);
  const markdownUrl = getLLMMarkdownUrl("docs", page.slugs);

  return (
    <DocsPageRenderer
      title={displayTitle}
      description={page.data.description}
      layout={page.data.layout}
      full={page.data.full}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      markdownUrl={markdownUrl}
    >
      <MDX components={mdxComponents} />
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  return buildDocsPageMetadata({
    title: page.data.title,
    description: page.data.description,
    deprecated,
  });
}

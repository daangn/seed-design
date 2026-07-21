import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { aiIntegrationSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { mdxComponents } from "@/components/mdx-components";
import { buildDocsPageMetadata, resolveCoverImage } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = aiIntegrationSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const markdownUrl = getLLMMarkdownUrl("ai-integration", page.slugs);
  const cover = page.data.coverImage ? resolveCoverImage(page.data.coverImage) : null;
  const displayTitle = page.data.heading ?? page.data.title;

  return (
    <DocsPageRenderer
      title={displayTitle}
      description={page.data.description}
      coverImage={
        cover
          ? {
              src: cover.thumbnail,
              alt: `${displayTitle} cover image`,
              width: cover.og.width,
              height: cover.og.height,
            }
          : undefined
      }
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
  return aiIntegrationSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = aiIntegrationSource.getPage(params.slug ?? []);
  if (!page) notFound();

  return buildDocsPageMetadata({
    title: page.data.title,
    heading: page.data.heading,
    description: page.data.description,
    coverImage: page.data.coverImage,
  });
}

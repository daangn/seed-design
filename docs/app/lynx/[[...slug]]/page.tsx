import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getLynxSource } from "@/app/source";
import { LynxCompatibilityBadges } from "@/components/lynx-compatibility";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { buildDocsPageJsonLd, buildDocsPageMetadata, resolveCoverImage } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const lynxSource = await getLynxSource();
  const page = lynxSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body, toc, lastModified } = await loadMarkdownPage(page);
  const markdownUrl = getLLMMarkdownUrl("lynx", page.slugs);
  const cover = page.data.frontmatter.coverImage
    ? resolveCoverImage(page.data.frontmatter.coverImage)
    : null;
  const displayTitle = page.data.frontmatter.heading ?? page.data.title;

  return (
    <DocsPageRenderer
      jsonLd={buildDocsPageJsonLd(page)}
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
      layout={page.data.frontmatter.layout}
      full={page.data.frontmatter.full}
      meta={<LynxCompatibilityBadges compatibility={page.data.frontmatter.compatibility?.lynx} />}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      section="lynx"
      markdownUrl={markdownUrl}
    >
      {body}
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  const lynxSource = await getLynxSource();
  return lynxSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lynxSource = await getLynxSource();
  const page = lynxSource.getPage(params.slug ?? []);
  if (!page) notFound();

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    heading: page.data.frontmatter.heading,
    description: page.data.description,
    coverImage: page.data.frontmatter.coverImage,
  });
}

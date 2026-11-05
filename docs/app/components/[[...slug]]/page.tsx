import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getComponentsSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { PlatformStatusTable } from "@/components/platform-status-table";
import { getComponentStatus } from "@/lib/rootage";
import {
  buildDocsPageJsonLd,
  buildDocsPageMetadata,
  deprecatedTitle,
  resolveCoverImage,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const componentsSource = await getComponentsSource();
  const page = componentsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body, toc, lastModified } = await loadMarkdownPage(page);
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.frontmatter.deprecated,
  });

  const heading = page.data.frontmatter.heading ?? page.data.title;
  const displayTitle = deprecatedTitle(heading, deprecated);
  const markdownUrl = getLLMMarkdownUrl("components", page.slugs);
  const cover = page.data.frontmatter.coverImage
    ? resolveCoverImage(page.data.frontmatter.coverImage)
    : null;

  // 플랫폼 상태를 헤더에 렌더한다. componentIds 프론트매터가 있으면 그 목록(서브컴포넌트를
  // 여럿 다루는 list/manner-temp), 없으면 slug 하나로 간주한다.
  const slugId = page.slugs.at(-1);
  const componentIds = page.data.frontmatter.componentIds ?? (slugId ? [slugId] : []);
  const platformStatus =
    componentIds.length > 0 ? (
      <PlatformStatusTable componentIds={componentIds} inHeader />
    ) : undefined;

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
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      section="components"
      markdownUrl={markdownUrl}
      platformStatus={platformStatus}
    >
      {body}
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  const componentsSource = await getComponentsSource();
  return componentsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const componentsSource = await getComponentsSource();
  const page = componentsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.frontmatter.deprecated,
  });

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    heading: page.data.frontmatter.heading,
    description: page.data.description,
    coverImage: page.data.frontmatter.coverImage,
    deprecated,
  });
}

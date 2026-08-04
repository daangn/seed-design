import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { componentsSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { mdxComponents } from "@/components/mdx-components";
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
  const page = componentsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  const heading = page.data.heading ?? page.data.title;
  const displayTitle = deprecatedTitle(heading, deprecated);
  const markdownUrl = getLLMMarkdownUrl("components", page.slugs);
  const cover = page.data.coverImage ? resolveCoverImage(page.data.coverImage) : null;

  // 플랫폼 상태를 헤더에 렌더한다. componentIds 프론트매터가 있으면 그 목록(서브컴포넌트를
  // 여럿 다루는 list/manner-temp), 없으면 slug 하나로 간주한다.
  const slugId = page.slugs.at(-1);
  const componentIds = page.data.componentIds ?? (slugId ? [slugId] : []);
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
      layout={page.data.layout}
      full={page.data.full}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      markdownUrl={markdownUrl}
      platformStatus={platformStatus}
    >
      <MDX components={mdxComponents} />
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  return componentsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = componentsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    heading: page.data.heading,
    description: page.data.description,
    coverImage: page.data.coverImage,
    deprecated,
  });
}

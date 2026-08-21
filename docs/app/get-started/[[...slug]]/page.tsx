import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getGetStartedSource } from "@/app/source";
import { ProsePage } from "@/components/layout/prose-page";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { getComponentStatus } from "@/lib/rootage";
import { JsonLd } from "@/components/json-ld";
import { LlmsLinkRels } from "@/components/llms-link-rels";
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
  const getStartedSource = await getGetStartedSource();
  const page = getStartedSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body } = await loadMarkdownPage(page);
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.frontmatter.deprecated,
  });

  const heading = page.data.frontmatter.heading ?? page.data.title;
  const displayTitle = deprecatedTitle(heading, deprecated);
  const cover = page.data.frontmatter.coverImage
    ? resolveCoverImage(page.data.frontmatter.coverImage)
    : null;

  return (
    <ProsePage title={displayTitle} description={page.data.description}>
      <LlmsLinkRels
        section="get-started"
        markdownUrl={getLLMMarkdownUrl("get-started", params.slug ?? [])}
      />
      <JsonLd data={buildDocsPageJsonLd(page)} />
      {cover ? (
        <div className="not-prose mb-8 md:mb-10">
          <img
            src={cover.thumbnail}
            alt="SEED Design System"
            width={cover.og.width}
            height={cover.og.height}
            className="block h-auto w-full rounded-r4"
            loading="eager"
          />
        </div>
      ) : null}
      {body}
    </ProsePage>
  );
}

export async function generateStaticParams() {
  const getStartedSource = await getGetStartedSource();
  return getStartedSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const getStartedSource = await getGetStartedSource();
  const page = getStartedSource.getPage(params.slug ?? []);
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

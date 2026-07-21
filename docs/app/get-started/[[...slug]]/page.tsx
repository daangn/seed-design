import { getStartedSource } from "@/app/source";
import { ProsePage } from "@/components/layout/prose-page";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/lib/rootage";
import { buildDocsPageMetadata, deprecatedTitle, resolveCoverImage } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = getStartedSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX } = await page.data.load();
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  const heading = page.data.heading ?? page.data.title;
  const displayTitle = deprecatedTitle(heading, deprecated);
  const cover = page.data.coverImage ? resolveCoverImage(page.data.coverImage) : null;

  return (
    <ProsePage title={displayTitle} description={page.data.description}>
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
      <MDX components={mdxComponents} />
    </ProsePage>
  );
}

export async function generateStaticParams() {
  return getStartedSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getStartedSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  return buildDocsPageMetadata({
    title: page.data.title,
    heading: page.data.heading,
    description: page.data.description,
    coverImage: page.data.coverImage,
    deprecated,
  });
}

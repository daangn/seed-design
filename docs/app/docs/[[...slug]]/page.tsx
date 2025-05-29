import { source } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import { client } from "@/sanity/lib/client";
import { GUIDELINE_QUERY } from "@/sanity/lib/queries";
import { PortableContent } from "@/sanity/lib/sanity-content";
import { PortableText } from "@portabletext/react";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableTextBlock } from "sanity";

function getPath(slug: string[]) {
  return slug.join("/");
}

function styleToLevel(style: unknown) {
  if (typeof style !== "string") return;
  return Number.parseInt(style.split("h")[1]);
}

export const dynamic = "force-static";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();

  const path = getPath(params.slug ?? []);
  const guideline = await client.fetch(GUIDELINE_QUERY, { path }, { cache: "no-store" });
  const guidelineToc =
    guideline?.toc?.map((item: PortableTextBlock) => {
      return {
        depth: item.level ?? styleToLevel(item.style) ?? 0,
        title: (
          <PortableText
            value={{
              ...(item as PortableTextBlock),
              style: undefined,
            }}
          />
        ),
        url: `#${item._key}`,
      };
    }) ?? [];

  return (
    <DocsPage toc={[...guidelineToc, ...toc]} full={page.data.full} lastUpdate={lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {guideline && <PortableContent content={guideline.content} />}
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}

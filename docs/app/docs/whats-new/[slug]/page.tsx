import { client } from "@/sanity/lib/client";
import { SanityImage } from "@/sanity/lib/image";
import { BLOG_QUERY, SINGLE_BLOG_QUERY } from "@/sanity/lib/queries";
import { PortableContent } from "@/sanity/lib/sanity-content";
import { SanityImageAsset } from "@sanity/asset-utils";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableTextBlock } from "sanity";

interface Article {
  title: string;
  description: string;
  thumbnail: SanityImageAsset;
  slug: {
    current: string;
    _type: "slug";
  };
  publishedAt: string;
  content: PortableTextBlock | PortableTextBlock[];
  toc?: {
    _key: string;
    level: number;
  }[];
}

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: { slug?: string };
}) {
  const page = await client.fetch<Article>(
    SINGLE_BLOG_QUERY,
    {
      slug: params.slug,
    },
    {
      cache: "no-store",
    },
  );

  if (!page) {
    notFound();
  }

  const toc = page.toc?.map((item) => {
    return {
      depth: item.level ?? 0,
      title: (
        <PortableContent
          content={{
            ...(item as PortableTextBlock),
            style: undefined,
          }}
        />
      ),
      url: `#${item._key}`,
    };
  });

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <SanityImage value={page.thumbnail} className="rounded-[26px]" />
        <PortableContent content={page.content} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const articles = await client.fetch<Article[]>(
    BLOG_QUERY,
    {},
    {
      perspective: "published",
      cache: "no-store",
    },
  );

  const slugs = articles.map((article) => {
    return { slug: article.slug.current };
  });

  return slugs;
}

export async function generateMetadata({ params }: { params: { slug?: string } }) {
  const articles = await client.fetch<Article[]>(
    BLOG_QUERY,
    {},
    {
      perspective: "published",
    },
  );

  const page = articles.find((article) => article.slug.current === params.slug);

  return {
    title: page?.title,
    description: page?.description,
  } satisfies Metadata;
}

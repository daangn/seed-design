import { source } from "@/app/source";
import { client } from "@/sanity/lib/client";
import { SanityImage } from "@/sanity/lib/image";
import { BLOG_QUERY } from "@/sanity/lib/queries";
import type { SanityImageAsset } from "@sanity/asset-utils";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Article {
  title: string;
  description: string;
  thumbnail: SanityImageAsset;
  slug: {
    current: string;
    _type: "slug";
  };
  publishedAt: string;
}

export default async function Page() {
  const page = source.getPage(["whats-new"]);
  if (!page) notFound();

  const articles = await client.fetch<Article[]>(
    BLOG_QUERY,
    {},
    {
      perspective: "published",
    },
  );

  return (
    <DocsPage>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          {articles?.map((item) => (
            <Link href={`/docs/whats-new/${item.slug.current}`} key={item.slug.current}>
              <ArticleCard {...item} />
            </Link>
          ))}
        </div>
      </DocsBody>
    </DocsPage>
  );
}

function ArticleCard({ title, description, thumbnail }: Article) {
  return (
    <div className="flex flex-col items-start h-full text-left hover:bg-gray-100 rounded-[26px] transition-all duration-200 dark:hover:bg-neutral-800">
      <SanityImage
        value={thumbnail}
        className="rounded-3xl aspect-[16/9] h-full w-full object-cover my-0"
      />
      <div className="flex flex-col gap-2 px-[10px] py-[24px]">
        <h3 className="font-bold text-lg sm:text-xl">{title}</h3>
        <p className="text-gray-500 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
}

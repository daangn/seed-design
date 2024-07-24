import { allContents } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer2/hooks";

import type { Metadata } from "next";

interface ContentPageProps {
  params: {
    slug: string;
  };
}

async function getContentFromParams({ params }: ContentPageProps) {
  const slug = params.slug;
  const content = allContents.find((content) => content.slug === slug);

  if (!content) {
    return null;
  }

  return content;
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const content = await getContentFromParams({ params });

  if (!content) {
    return {};
  }

  return {
    title: content.title,
    openGraph: {
      title: content.title,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
    },
  };
}

export async function generateStaticParams(): Promise<ContentPageProps["params"][]> {
  return allContents.map((content) => ({
    slug: content.slug,
  }));
}

export default async function ContentPage({ params }: ContentPageProps) {
  const content = await getContentFromParams({ params });
  const MDXComponent = getMDXComponent(content?.body.code || "");

  if (!content) {
    return <div>Not found</div>;
  }

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1>{content?.title}</h1>
      <MDXComponent />
    </div>
  );
}

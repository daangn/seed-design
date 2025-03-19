import { reactSource } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: "clerk",
        single: false,
      }}
      full={page.data.full}
      lastUpdate={lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return reactSource.generateParams();
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}

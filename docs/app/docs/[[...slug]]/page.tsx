import { docsSource } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/components/rootage";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated, deprecatedMessage } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  const displayTitle = deprecated ? `${page.data.title} (Deprecated)` : page.data.title;
  const displayDescription = deprecated ? (
    <span className="text-red-800">
      {deprecatedMessage} <span className="text-gray-600">{page.data.description}</span>
    </span>
  ) : (
    <span>{page.data.description}</span>
  );
  return (
    <DocsPage toc={toc} full={page.data.full} lastUpdate={lastModified}>
      <DocsTitle>{displayTitle}</DocsTitle>
      <DocsDescription>{displayDescription}</DocsDescription>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = docsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const loadedData = await page.data.load();
  const frontmatterDeprecated = (loadedData as any).deprecated;
  const { deprecated } = await getComponentStatus(params, { deprecated: frontmatterDeprecated });

  // Add (Deprecated) to title if component is deprecated
  const displayTitle =
    deprecated && !page.data.title.includes("(Deprecated)")
      ? `${page.data.title} (Deprecated)`
      : page.data.title;

  return {
    title: displayTitle,
    description: page.data.description,
  } satisfies Metadata;
}

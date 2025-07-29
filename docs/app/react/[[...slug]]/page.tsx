import { reactSource } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/components/rootage";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated, deprecatedMessage, experimental, experimentalMessage } =
    await getComponentStatus(params, {
      deprecated: page.data.deprecated,
      experimental: page.data.experimental,
    });

  const displayTitle = deprecated
    ? `${page.data.title} (Deprecated)`
    : experimental
      ? `${page.data.title} (Experimental)`
      : page.data.title;
  const displayDescription = deprecated ? (
    <span className="text-red-600">
      {deprecatedMessage} <span className="text-gray-600">{page.data.description}</span>
    </span>
  ) : experimental ? (
    <span className="text-yellow-600">
      {experimentalMessage || "This component is experimental. Its API may change."}{" "}
      <span className="text-gray-600">{page.data.description}</span>
    </span>
  ) : (
    <span>{page.data.description}</span>
  );

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
      <DocsTitle>{displayTitle}</DocsTitle>
      <DocsDescription>{displayDescription}</DocsDescription>
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return reactSource.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const loadedData = await page.data.load();
  const frontmatterDeprecated = (loadedData as any).deprecated;
  const frontmatterExperimental = (loadedData as any).experimental;
  const { deprecated, experimental } = await getComponentStatus(params, {
    deprecated: frontmatterDeprecated,
    experimental: frontmatterExperimental,
  });

  // Add (Deprecated) or (Experimental) to title if component is deprecated or experimental
  const displayTitle =
    deprecated && !page.data.title.includes("(Deprecated)")
      ? `${page.data.title} (Deprecated)`
      : experimental && !page.data.title.includes("(Experimental)")
        ? `${page.data.title} (Experimental)`
        : page.data.title;

  return {
    title: displayTitle,
    description: page.data.description,
  } satisfies Metadata;
}

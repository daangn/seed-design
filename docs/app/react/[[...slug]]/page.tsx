import { archivePaths } from "@/lib/docs-archive";
import { getGitHubSourceUrl } from "@/app/_llms/config";
import { getReactSource } from "@/app/sources/react-source";
import { mdxComponents } from "@/components/mdx-components";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { getComponentStatus } from "@/components/rootage";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const params = { slug: archivePaths.contentSlug(slug) };
  const reactSource = await getReactSource();
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated, deprecatedMessage } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  const displayTitle = deprecated ? `${page.data.title} (Deprecated)` : page.data.title;
  const displayDescription = deprecated ? (
    <span className="text-red-600">
      {deprecatedMessage} <span className="text-gray-600">{page.data.description}</span>
    </span>
  ) : (
    <span>{page.data.description}</span>
  );

  const slugsWithExt = page.slugs.map((s, i) => (i === page.slugs.length - 1 ? `${s}.txt` : s));
  const markdownUrl = archivePaths.endpoint(`/llms/react/${slugsWithExt.join("/")}`);

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
      <div className="flex flex-row gap-2 items-center mb-3 justify-end">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions markdownUrl={markdownUrl} githubUrl={getGitHubSourceUrl("react", page.path)} />
      </div>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const reactSource = await getReactSource();
  return reactSource
    .generateParams()
    .map((params) => ({ slug: archivePaths.routeSlug(params.slug) }));
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const params = { slug: archivePaths.contentSlug(slug) };
  const reactSource = await getReactSource();
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  // Add (Deprecated) to title if component is deprecated
  const displayTitle =
    deprecated && !page.data.title.includes("(Deprecated)")
      ? `${page.data.title} (Deprecated)`
      : page.data.title;

  return {
    alternates: {
      canonical: `https://seed-design.io${archivePaths.reactBase}${page.slugs.length ? "/" + page.slugs.join("/") : ""}`,
    },
    title: displayTitle,
    description: page.data.description,
  } satisfies Metadata;
}

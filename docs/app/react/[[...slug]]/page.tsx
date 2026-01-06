import { shouldGenerateLLMFriendlyText } from "@/app/react/_llms/page-filter";
import { getSourceUrl } from "@/app/react/_llms/url";
import { reactSource } from "@/app/source";
import { mdxComponents } from "@/components/mdx-components";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { getComponentStatus } from "@/components/rootage";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;

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

  const llmsSlugs = page.slugs.map((slug, index) => {
    if (index === 0 && slug === "components") {
      return "llms-components";
    }

    if (index === page.slugs.length - 1) {
      return `${slug}.txt`;
    }

    return slug;
  });

  const markdownUrl = `/react/${llmsSlugs.join("/")}`;

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
      {shouldGenerateLLMFriendlyText(page) && (
        <div className="flex flex-row gap-2 items-center mb-3 justify-end">
          <LLMCopyButton markdownUrl={markdownUrl} />
          <ViewOptions markdownUrl={markdownUrl} githubUrl={getSourceUrl(page.path)} />
        </div>
      )}
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
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

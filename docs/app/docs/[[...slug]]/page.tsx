import { getGitHubSourceUrl, getLLMMarkdownUrl } from "@/app/_llms/config";
import { docsSource } from "@/app/source";
import { LLMOptions, ViewOptions } from "@/components/page-actions";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/components/rootage";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={match.index} href={match[2]} className="underline font-medium">
        {match[1]}
      </Link>,
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

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
      {deprecatedMessage ? renderInlineMarkdown(deprecatedMessage) : null}{" "}
      <span className="text-gray-600">{page.data.description}</span>
    </span>
  ) : (
    <span>{page.data.description}</span>
  );
  const markdownUrl = getLLMMarkdownUrl("docs", page.slugs);

  return (
    <DocsPage toc={toc} full={page.data.full} lastUpdate={lastModified}>
      <DocsTitle>{displayTitle}</DocsTitle>
      <DocsDescription>{displayDescription}</DocsDescription>
      <div className="flex flex-row gap-2 items-center mb-3 justify-end">
        <LLMOptions markdownUrl={markdownUrl} />
        <ViewOptions markdownUrl={markdownUrl} githubUrl={getGitHubSourceUrl("docs", page.path)} />
      </div>
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

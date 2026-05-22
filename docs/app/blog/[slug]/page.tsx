import { getGitHubSourceUrl, getLLMMarkdownUrl } from "@/app/_llms/config";
import { blogSource } from "@/app/source";
import { env } from "@/app/env";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import { mdxComponents } from "@/components/mdx-components";
import { LLMOptions, ViewOptions } from "@/components/page-actions";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const client = env.figmaPersonalAccessToken
  ? createFigmaClient(env.figmaPersonalAccessToken)
  : undefined;

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const markdownUrl = getLLMMarkdownUrl("blog", page.slugs);
  const publishedDate = page.data.publishedAt ? new Date(page.data.publishedAt) : null;

  const coverUrl =
    page.data.coverImageFigmaId && client && env.figmaFileKey
      ? (
          await fetchFigmaImageUrls({
            client,
            fileKey: env.figmaFileKey,
            nodeIds: [page.data.coverImageFigmaId],
            options: { format: "png", scale: 2 },
          })
        ).get(page.data.coverImageFigmaId)
      : undefined;

  return (
    <DocsPage toc={toc} lastUpdate={lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {publishedDate && (
        <div className="flex flex-row gap-3 items-center mb-3 text-sm text-fd-muted-foreground">
          <time dateTime={publishedDate.toISOString()}>{dateFormatter.format(publishedDate)}</time>
        </div>
      )}
      <div className="flex flex-row gap-2 items-center mb-3 justify-end">
        <LLMOptions markdownUrl={markdownUrl} />
        <ViewOptions markdownUrl={markdownUrl} githubUrl={getGitHubSourceUrl("blog", page.path)} />
      </div>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            className="rounded-3xl aspect-[16/9] w-full object-cover my-0"
          />
        )}
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

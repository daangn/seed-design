import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { reactSource } from "@/app/source";
import { ChangelogLLMOptions } from "@/components/changelog-viewer/changelog-llm-options";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/lib/rootage";
import { findTabbedFolder, tabbedFolderLabel } from "@/lib/tabbed";
import {
  buildDocsPageJsonLd,
  buildDocsPageMetadata,
  deprecatedTitle,
  resolveCoverImage,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  // 탭형 subject 폴더는 헤더(title/description)를 meta.json에서 온 고정 값으로 쓴다
  // — 탭을 바꿔도 subject가 유지되도록(foundations 라우트와 같은 규칙).
  const tabbedFolder = findTabbedFolder(reactSource.pageTree.children, page.url);
  const heading =
    (tabbedFolder ? tabbedFolderLabel(tabbedFolder) : page.data.heading) ?? page.data.title;
  const displayTitle = deprecatedTitle(heading, deprecated);
  const displayDescription = tabbedFolder
    ? (tabbedFolder.description ?? page.data.description)
    : page.data.description;

  const markdownUrl = getLLMMarkdownUrl("react", page.slugs);
  const isChangelog = page.slugs.join("/") === "updates/changelog";
  const cover = page.data.coverImage ? resolveCoverImage(page.data.coverImage) : null;

  return (
    <DocsPageRenderer
      jsonLd={buildDocsPageJsonLd(page)}
      title={displayTitle}
      description={displayDescription}
      coverImage={
        cover
          ? {
              src: cover.thumbnail,
              alt: `${displayTitle} cover image`,
              width: cover.og.width,
              height: cover.og.height,
            }
          : undefined
      }
      layout={page.data.layout}
      full={isChangelog ? true : page.data.full}
      toc={isChangelog ? [] : toc}
      lastUpdate={lastModified}
      tableOfContent={isChangelog ? { enabled: false } : { single: false }}
      showPageActions={page.slugs.length > 0}
      markdownUrl={markdownUrl}
      llmOptions={isChangelog ? <ChangelogLLMOptions fallbackUrl={markdownUrl} /> : undefined}
    >
      <MDX components={mdxComponents} />
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  return reactSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = reactSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  // 페이지 h1과 동일한 파생(탭형이면 폴더 이름) — og:title이 탭 전환에도 subject를 유지.
  const tabbedFolder = findTabbedFolder(reactSource.pageTree.children, page.url);

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    heading:
      page.data.heading ??
      (tabbedFolder ? `${tabbedFolderLabel(tabbedFolder)} — ${page.data.title}` : undefined),
    description: page.data.description,
    coverImage: page.data.coverImage,
    deprecated,
  });
}

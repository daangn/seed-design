import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { foundationsSource } from "@/app/source";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { mdxComponents } from "@/components/mdx-components";
import { getComponentStatus } from "@/lib/rootage";
import { buildDocsPageMetadata, deprecatedTitle, resolveCoverImage } from "@/lib/seo";
import { findTabbedFolder, tabbedFolderLabel } from "@/lib/tabbed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = foundationsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();
  const { deprecated } = await getComponentStatus(params, {
    deprecated: page.data.deprecated,
  });

  // 탭형 subject 폴더는 상단 헤더(title/description/thumbnail)를 meta.json에서 온 **고정** 값으로
  // 쓴다(탭 전환에도 불변 → 시프팅 없음). 각 탭 frontmatter의 description/coverImage는 페이지에
  // 렌더하지 않고 OG/공유(generateMetadata)에만 쓴다. 비탭 페이지는 기존대로 page 데이터.
  const tabbedFolder = findTabbedFolder(foundationsSource.pageTree.children, page.url);
  const heading =
    (tabbedFolder ? tabbedFolderLabel(tabbedFolder) : page.data.heading) ?? page.data.title;
  const title = deprecatedTitle(heading, deprecated);
  const description = tabbedFolder ? tabbedFolder.description : page.data.description;
  const coverBase = tabbedFolder ? tabbedFolder.coverImage : page.data.coverImage;
  const cover = coverBase ? resolveCoverImage(coverBase) : null;
  const markdownUrl = getLLMMarkdownUrl("foundations", page.slugs);

  return (
    <DocsPageRenderer
      title={title}
      description={description}
      coverImage={
        cover
          ? {
              src: cover.thumbnail,
              alt: `${heading} cover image`,
              width: cover.og.width,
              height: cover.og.height,
            }
          : undefined
      }
      layout={page.data.layout}
      full={page.data.full}
      tabbed={tabbedFolder != null}
      toc={toc}
      lastUpdate={lastModified}
      showPageActions={page.slugs.length > 0}
      markdownUrl={markdownUrl}
    >
      <MDX components={mdxComponents} />
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  return foundationsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = foundationsSource.getPage(params.slug ?? []);
  if (!page) notFound();

  const { deprecated } = await getComponentStatus(params, { deprecated: page.data.deprecated });

  // 페이지 h1과 동일한 파생(탭형이면 폴더 이름) — og:title이 탭 전환에도 subject를 유지.
  const tabbedFolder = findTabbedFolder(foundationsSource.pageTree.children, page.url);

  return buildDocsPageMetadata({
    title: page.data.title,
    heading:
      page.data.heading ??
      (tabbedFolder ? `${tabbedFolderLabel(tabbedFolder)} — ${page.data.title}` : undefined),
    description: page.data.description,
    coverImage: page.data.coverImage,
    deprecated,
  });
}

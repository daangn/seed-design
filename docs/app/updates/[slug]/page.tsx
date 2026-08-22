import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { env } from "@/app/env";
import { getUpdatesSource } from "@/app/source";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import { DocsPageRenderer } from "@/components/layout/docs-page-renderer";
import { formatPublishedDate } from "@/lib/format-date";
import { loadMarkdownPage } from "@/lib/load-markdown-page";
import { buildDocsPageJsonLd, buildDocsPageMetadata, resolveCoverImage } from "@/lib/seo";
import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShareButton } from "./share-button";

export const dynamic = "force-static";

const client = env.figmaPersonalAccessToken
  ? createFigmaClient(env.figmaPersonalAccessToken)
  : undefined;

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const updatesSource = await getUpdatesSource();
  const page = updatesSource.getPage([params.slug]);
  if (!page) notFound();

  const { body, toc, lastModified } = await loadMarkdownPage(page);
  const markdownUrl = getLLMMarkdownUrl("updates", page.slugs);
  const publishedDate = page.data.frontmatter.publishedAt
    ? new Date(page.data.frontmatter.publishedAt)
    : null;

  // 같은 라우트가 두 종류의 글을 렌더한다.
  // - `post`: 에세이. ToC 없이 중앙 정렬된 단독 컬럼으로 처음부터 끝까지 읽는다.
  // - `release`: 릴리즈 노트. 훑고 필요한 항목으로 점프하는 문서라 ToC를 켜고 docs 기본 조판을 쓴다.
  //   커버·중앙 정렬·확대 prose·`.updates-article`(h2 위 6rem 여백)은 섹션이 많은 글에 과하므로 전부 뺀다.
  const isRelease = page.data.frontmatter.category === "release";

  // 정적 커버(노션 추출 webp 등)를 우선하고, 없으면 Figma id로 폴백.
  const coverUrl = isRelease
    ? undefined
    : page.data.frontmatter.coverImage
      ? resolveCoverImage(page.data.frontmatter.coverImage).thumbnail
      : page.data.frontmatter.coverImageFigmaId && client && env.figmaFileKey
        ? (
            await fetchFigmaImageUrls({
              client,
              fileKey: env.figmaFileKey,
              nodeIds: [page.data.frontmatter.coverImageFigmaId],
              options: { format: "png", scale: 2 },
            })
          ).get(page.data.frontmatter.coverImageFigmaId)
        : undefined;

  return (
    <DocsPageRenderer
      jsonLd={buildDocsPageJsonLd(page)}
      title={page.data.title}
      description={isRelease ? page.data.description : undefined}
      coverImage={
        coverUrl
          ? { src: coverUrl, alt: `${page.data.title} cover image`, width: 1600, height: 900 }
          : undefined
      }
      // 커버를 본문(900px)보다 살짝 넓게. 콘텐츠 캡(`*:max-w-[900px]`)을 override.
      coverClassName="!max-w-[1024px]"
      toc={isRelease ? toc : []}
      tableOfContent={isRelease ? { single: false } : { enabled: false }}
      lastUpdate={lastModified}
      section="updates"
      markdownUrl={markdownUrl}
      topSpacing
      // Updates 전용 스코프 클래스 — 남은 국소 스타일(소제목 여백·이미지 radius)만 updates-article.css에서
      // `.updates-article` 하위로 정의해 docs 전역으로 새지 않게 한다. 나머지 소제목/본문 크기·색은
      // 아래 bodyClassName의 prose 유틸로 옮겼다.
      articleClassName={isRelease ? undefined : "updates-article"}
      // Updates 본문(.prose) 전용 타이포그래피. `prose-*` 유틸은 @layer utilities라 fumadocs 기본
      // 타이포그래피(@layer components)를 이기고, `.not-prose`(CTA 카드) 내부 h3·p·em은 자동 제외되므로
      // 카드 텍스트는 원래 크기를 유지한다(과거 `:not([data-card="true"] *)` 가드와 동일 효과).
      // - 소제목 h2 28px > h3 24px > 본문 p·li 18px(line-height 1.7)로 위계를 세운다. h2/h3를 같은
      //   크기로 두면 "Part(h2) > 소제목(h3)" 2단 구조인 글에서 두 레벨이 구분되지 않는다.
      // - 이탤릭(em) SEED gray-700 톤다운.
      // 소제목 위 여백은 `:not(:first-child)`가 필요해 유틸로 표현 불가 → updates-article.css에 잔존.
      bodyClassName={
        isRelease
          ? undefined
          : "prose-h2:text-[1.75rem] prose-h3:text-[1.5rem] prose-p:text-[1.125rem] prose-li:text-[1.125rem] prose-p:leading-[1.7] prose-li:leading-[1.7] prose-em:text-[color:var(--seed-color-palette-gray-700)]"
      }
      titleClassName={isRelease ? undefined : "text-center text-balance break-keep wrap-anywhere"}
      meta={
        publishedDate ? (
          <div
            className={clsx(
              "not-prose mt-2 mb-3 flex items-center gap-1.5 text-base text-fd-muted-foreground",
              isRelease ? "justify-start" : "justify-center",
            )}
          >
            <time dateTime={publishedDate.toISOString()}>{formatPublishedDate(publishedDate)}</time>
            <ArticleShareButton title={page.data.title} />
          </div>
        ) : undefined
      }
    >
      {body}
    </DocsPageRenderer>
  );
}

export async function generateStaticParams() {
  const updatesSource = await getUpdatesSource();
  return updatesSource.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const updatesSource = await getUpdatesSource();
  const page = updatesSource.getPage([params.slug]);
  if (!page) notFound();

  return buildDocsPageMetadata({
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    coverImage: page.data.frontmatter.coverImage,
    // Updates는 블로그성 글이라 og:type을 article로 올리고 발행일을 노출한다.
    publishedTime: page.data.frontmatter.publishedAt
      ? new Date(page.data.frontmatter.publishedAt).toISOString()
      : undefined,
  });
}

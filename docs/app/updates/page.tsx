import { env } from "@/app/env";
import { updatesSource } from "@/app/source";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import { BLOG_POSTS } from "@/components/landing/lib/landing-content";
import { ProsePage } from "@/components/layout/prose-page";
import { formatPublishedDate } from "@/lib/format-date";
import { buildSeoMetadata, resolveCoverImage } from "@/lib/seo";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { ReleaseCard } from "./release-card";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const client = env.figmaPersonalAccessToken
  ? createFigmaClient(env.figmaPersonalAccessToken)
  : undefined;

const UPDATES_COVER_IMAGE = "/og/updates";
const UPDATES_TITLE = "Updates";
const UPDATES_DESCRIPTION = "SEED 업데이트 소식과 릴리즈 노트";

// Internal 카드 썸네일은 상세 페이지와 동일한 글 커버(coverImageFigmaId)를 그대로 쓴다.
// index도 force-static이라 상세 페이지처럼 빌드 1회 페치로 끝(런타임 페치 아님).
// Figma 미연결(로컬 등) 시 Updates 섹션 커버로 폴백.
const INTERNAL_FALLBACK = "/og/updates.webp";

const SECTION_HEADING_CLASS =
  "mb-5 text-xl font-semibold tracking-tight text-fd-foreground md:mb-6 md:text-2xl";

interface UpdateCard {
  title: string;
  description?: string;
  image: string;
  href: string;
  /** ISO date; undefined면 정렬 시 최신으로 취급(상단). */
  publishedAt?: string;
  external: boolean;
  /** frontmatter `category`. 외부 글은 항상 "post". */
  category: "post" | "release";
}

/**
 * 카드 소스 통합: 내부 업데이트 글(updatesSource) + 외부 팀블로그 글(BLOG_POSTS, 랜딩과 공유).
 * publishedAt desc 정렬 — 날짜 미정(외부 placeholder)은 상단 유지. URL/게시일이 확정되면
 * 자동으로 제자리 정렬된다.
 */
async function buildCards(): Promise<UpdateCard[]> {
  const internalPages = updatesSource.getPages();

  // 상세 페이지와 동일한 Figma 커버를 한 번에 배치 페치(빌드타임).
  const figmaIds = internalPages
    .map((post) => post.data.coverImageFigmaId)
    .filter((id): id is string => Boolean(id));
  const coverMap =
    client && env.figmaFileKey && figmaIds.length > 0
      ? await fetchFigmaImageUrls({
          client,
          fileKey: env.figmaFileKey,
          nodeIds: figmaIds,
          options: { format: "png", scale: 2 },
        })
      : new Map<string, string>();

  const internal: UpdateCard[] = internalPages.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    // 정적 커버(노션 추출 webp) 우선 → Figma 커버 → Updates 섹션 폴백.
    image:
      (post.data.coverImage && resolveCoverImage(post.data.coverImage).thumbnail) ||
      (post.data.coverImageFigmaId && coverMap.get(post.data.coverImageFigmaId)) ||
      INTERNAL_FALLBACK,
    href: post.url,
    publishedAt: post.data.publishedAt ? new Date(post.data.publishedAt).toISOString() : undefined,
    external: false,
    category: post.data.category,
  }));

  // 외부 카드는 external:true 항목만 — 내부 글로 이관된 항목이 BLOG_POSTS에 남아 있어도
  // (랜딩과 공유) 여기서 걸러 내부 MDX 카드와 중복 노출되지 않게 한다.
  const external: UpdateCard[] = BLOG_POSTS.filter((post) => post.external).map((post) => ({
    title: post.title,
    description: post.description,
    image: post.image,
    href: post.href,
    publishedAt: post.publishedAt,
    external: true,
    category: "post",
  }));

  return [...external, ...internal].sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : Number.POSITIVE_INFINITY;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : Number.POSITIVE_INFINITY;
    return tb - ta;
  });
}

/** 블로그형 카드: 16:9 썸네일 + 날짜/제목/설명. 외부 글에만 ↗ 화살표를 단다. */
function UpdateCardLink({ card }: { card: UpdateCard }) {
  const published = card.publishedAt ? new Date(card.publishedAt) : null;
  const className = "group block";

  const body = (
    <>
      <div className="mb-4 overflow-hidden rounded-r4">
        <img
          src={card.image}
          alt=""
          className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:[transform:scale(1.03)]"
          loading="lazy"
        />
      </div>
      {published && (
        <time dateTime={published.toISOString()} className="text-sm text-fd-muted-foreground">
          {formatPublishedDate(published)}
        </time>
      )}
      <div className="mt-1 flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium">{card.title}</h3>
        {/* 내부 링크는 클릭하면 같은 사이트 안에서 이동하므로 화살표가 정보를 더하지 않는다.
            새 탭으로 나가는 외부 글에만 ↗를 남긴다. */}
        {card.external && (
          <IconSeedArrow
            external
            className="mt-1 size-4 -translate-y-[0.5px] text-fd-muted-foreground"
          />
        )}
      </div>
      {card.description && (
        <p className="mt-1 text-sm text-fd-muted-foreground">{card.description}</p>
      )}
    </>
  );

  return card.external ? (
    <a href={card.href} target="_blank" rel="noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={card.href} className={className}>
      {body}
    </Link>
  );
}

/**
 * Updates 섹션 랜딩 — 사이드바 없는 1컬럼.
 * 릴리즈 노트(`category: release`)는 썸네일 없는 카드로 위에, 블로그 글은 카드 그리드로 아래에.
 * 릴리즈 노트는 버전마다 나가는 잦은 글이라 매번 16:9 커버를 만들지 않는다.
 */
export default async function Page() {
  const cover = resolveCoverImage(UPDATES_COVER_IMAGE);
  const cards = await buildCards();
  const releases = cards.filter((card) => card.category === "release");
  const posts = cards.filter((card) => card.category !== "release");

  return (
    <ProsePage title={UPDATES_TITLE} description={UPDATES_DESCRIPTION}>
      <div className="not-prose mb-8 md:mb-10">
        <img
          src={cover.thumbnail}
          alt="Updates cover image"
          width={cover.og.width}
          height={cover.og.height}
          className="block h-auto w-full rounded-r4"
          loading="eager"
        />
      </div>
      {releases.length > 0 && (
        <section className="not-prose mb-12 md:mb-16">
          <h2 className={SECTION_HEADING_CLASS}>Release Notes</h2>
          <div className="grid grid-cols-1 gap-y-x4 sm:grid-cols-2 sm:gap-x-x6">
            {releases.map((card) => (
              <ReleaseCard
                key={card.href}
                href={card.href}
                title={card.title}
                description={card.description}
                publishedAt={card.publishedAt}
              />
            ))}
          </div>
        </section>
      )}
      <section className="not-prose">
        <h2 className={SECTION_HEADING_CLASS}>Blog</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {posts.map((card) => (
            <UpdateCardLink key={`${card.href}::${card.title}`} card={card} />
          ))}
        </div>
      </section>
    </ProsePage>
  );
}

export function generateMetadata(): Metadata {
  const cover = resolveCoverImage(UPDATES_COVER_IMAGE);

  return buildSeoMetadata({
    title: UPDATES_TITLE,
    description: UPDATES_DESCRIPTION,
    image: cover.og,
  });
}

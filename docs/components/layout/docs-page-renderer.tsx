import type { Section } from "@/app/_llms/types";
import { JsonLd } from "@/components/json-ld";
import { LlmsLinkRels } from "@/components/llms-link-rels";
import { LLMOptions } from "@/components/page-actions";
import { HiddenTocPopover, SeedTableOfContents } from "@/components/table-of-contents";
import clsx from "clsx";
import { TOCProvider } from "fumadocs-ui/components/toc";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { ComponentProps, ReactNode } from "react";
import { DOC_TITLE_CLASS } from "./lib/doc-title";
import { DocsPrevNext } from "./docs-prev-next";
import { DocsTabStrip } from "./docs-tab-strip";
import { OverviewLayout, type PageCoverImage } from "./overview-layout";
import { SectionLabel } from "./section-label";
import { SiteFooter } from "./site-footer";

type DocsPageProps = ComponentProps<typeof DocsPage>;

/**
 * 사이트 footer를 notebook 그리드에서 콘텐츠 아래 새 행에 둔다(article grid-area:main 밖의
 * grid 직접 자식). 푸터 폭은 그 페이지의 콘텐츠 폭과 같은 결로 맞춘다(`matchContent` 참고).
 * 좌측 패딩은 article(`#nd-page`)과 동일해 좌측선이 콘텐츠와 정렬된다.
 */
function FooterBand({ matchContent }: { matchContent?: boolean }) {
  // 콘텐츠 행 "아래"(main-end 라인)에 둔다. gridRowStart가 없으면 auto-placement가
  // 비어있는 상단 header 행에 footer를 넣어버린다.
  // Tailwind 임의 속성의 `/` 파싱 이슈를 피하려고 inline style 사용.
  //
  // 푸터 폭·정렬은 그 페이지의 콘텐츠와 같은 결로 맞춘다:
  // - matchContent(ToC 있는 표준 상세 + overview): main 컬럼만 차지(toc 비침범)하고 내부를
  //   900px로 캡 + `mx-auto`로 중앙 정렬해, 콘텐츠(`*:mx-auto *:max-w-[900px]`, 중앙 정렬)와
  //   같은 축(좌우선·폭·중심)에 둔다. 사이드바 유무와 무관하게 콘텐츠 축과 겹친다.
  // - 기본값(full 페이지): main+toc를 가로질러 넓은 콘텐츠와 결을 맞춘다.
  return (
    <div
      className="px-4 md:px-6 xl:px-8 pb-14"
      style={{
        gridColumn: matchContent ? "main-start / main-end" : "main-start / toc-end",
        gridRowStart: "main-end",
      }}
    >
      {/* mx-auto max-w-[900px]: 콘텐츠(중앙 정렬 900px)와 같은 축에 정렬. */}
      <div className={matchContent ? "mx-auto max-w-[900px]" : undefined}>
        <SiteFooter />
      </div>
    </div>
  );
}

export interface DocsPageRendererProps {
  title: ReactNode;
  description?: ReactNode;
  coverImage?: PageCoverImage;
  /**
   * 커버 이미지 컨테이너에 덧붙일 클래스. 기본 커버 폭은 콘텐츠 캡(`*:max-w-[900px]`)과 같다.
   * 콘텐츠보다 살짝 넓은 커버가 필요할 때 폭 오버라이드용(예: `!max-w-[1024px]`).
   */
  coverClassName?: string;
  /** 콘텐츠 영역 레이아웃. "overview"면 표준 아티클 셸 대신 자체 레이아웃. */
  layout?: "docs" | "overview";
  full?: boolean;
  /**
   * 탭형 subject 페이지 여부. 현재 렌더러 내부 분기엔 쓰이지 않는다(탭 스트립은 self-gate,
   * 커버는 탭/비탭 공통 표시). 라우트 호환 위해 prop만 유지(breadcrumb 전 페이지 off는 별개).
   */
  tabbed?: boolean;
  toc: DocsPageProps["toc"];
  lastUpdate?: DocsPageProps["lastUpdate"];
  /** TOC 활성화/단일 항목 및 header/footer 설정. */
  tableOfContent?: DocsPageProps["tableOfContent"];
  /** 이 페이지가 속한 llms 섹션. `markdownUrl`과 짝이 되어 llms.txt 링크 릴레이션을 만든다. */
  section: Section;
  markdownUrl: string;
  /** 제목/설명 바로 아래(커버 이미지 위)에 렌더할 노드. 예: 컴포넌트 플랫폼 상태 스트립. */
  platformStatus?: ReactNode;
  /** LLMs.txt/action controls. Hide on section overview/root pages. */
  showPageActions?: boolean;
  /** 기본 LLMs.txt 옵션 대신 렌더할 노드 (예: changelog 전용) */
  llmOptions?: ReactNode;
  /** 제목·설명 아래(커버 위)에 렌더할 메타 노드. 예: Updates 글의 게시일. */
  meta?: ReactNode;
  /** 섹션 라벨과 제목 사이 여백을 키운다 — 제목·메타·커버를 한 세트로 보이게(예: Updates 글). */
  topSpacing?: boolean;
  /**
   * 아티클 루트(제목·메타·본문을 모두 감싸는 컨테이너)에 덧붙일 클래스. 라우트별 스코프 CSS의
   * 진입점이다(예: Updates 글의 `updates-article`). 전달됐을 때만 붙으므로, 이 값을 넘기지 않는
   * 다른 docs 페이지에는 영향이 없다. 스코프 CSS는 global.css에서 이 클래스 하위로만 정의한다.
   */
  articleClassName?: string;
  /**
   * 제목(DocsTitle/h1)에 덧붙일 클래스. DocsTitle은 전역 공유 컴포넌트라 여기 기본 클래스에 직접
   * 정렬 등을 박으면 다른 docs 페이지 제목이 회귀한다. 이 prop은 전달됐을 때만 붙으므로, 값을
   * 넘기지 않는 다른 라우트에는 영향이 없다(예: Updates 글의 `text-center`).
   */
  titleClassName?: string;
  /**
   * 본문(DocsBody/.prose)에 덧붙일 클래스. DocsBody 기본 className(`prose-p:break-keep …`)은 모든
   * docs가 공유하므로 여기 직접 라우트 스타일을 박으면 회귀한다. 이 prop은 전달됐을 때만 `clsx`로
   * append되어, 값을 넘기지 않는 다른 라우트에는 영향이 없다. `prose-*` 유틸은 `@layer utilities`라
   * fumadocs 기본 타이포그래피(@layer components)를 이기고 `.not-prose`(예: CTA 카드) 내부는 자동
   * 제외되므로, Updates 글의 소제목·본문 크기/색을 CSS 파일 없이 이 prop으로 스코프한다.
   */
  bodyClassName?: string;
  /**
   * schema.org 구조화 데이터. `lib/seo.ts`의 `buildDocsPageJsonLd(page)` 결과를 넘긴다.
   * Next `metadata` API로는 `ld+json`을 못 내보내서 여기서 script 태그로 렌더한다.
   */
  jsonLd?: object;
  /** 렌더된 MDX 본문 (`<MDX components={mdxComponents} />`) */
  children: ReactNode;
}

/**
 * 모든 docs 라우트가 공유하는 콘텐츠 페이지 프레젠테이션.
 * - 라우팅/데이터 로딩은 각 라우트의 page.tsx가 담당(라우트별 차이 보존).
 * - 표준 아티클(DocsPage) ↔ overview 레이아웃 분기 + 콘텐츠 아래 사이트 footer(main+toc 폭).
 */
export function DocsPageRenderer({
  title,
  description,
  coverImage,
  coverClassName,
  layout = "docs",
  full,
  toc,
  lastUpdate,
  tableOfContent,
  section,
  markdownUrl,
  platformStatus,
  showPageActions = true,
  llmOptions,
  meta,
  topSpacing,
  articleClassName,
  titleClassName,
  bodyClassName,
  jsonLd,
  children,
}: DocsPageRendererProps) {
  if (layout === "overview") {
    return (
      <>
        {jsonLd ? <JsonLd data={jsonLd} /> : null}
        <LlmsLinkRels section={section} markdownUrl={markdownUrl} />
        <OverviewLayout title={title} description={description} coverImage={coverImage} full={full}>
          {children}
        </OverviewLayout>
        <FooterBand matchContent={!full} />
      </>
    );
  }

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <LlmsLinkRels section={section} markdownUrl={markdownUrl} />
      <DocsPage
        // articleClassName은 전달된 라우트(예: Updates)에서만 붙어, 그 라우트 전용 스코프 CSS의
        // 진입점이 된다. 미전달 시 클래스가 붙지 않아 다른 docs 페이지엔 영향이 없다.
        className={clsx(full ? undefined : "*:mx-auto *:w-full", articleClassName)}
        toc={toc}
        full={full}
        breadcrumb={{ enabled: false }}
        lastUpdate={lastUpdate}
        // 비-full 페이지는 ToC 항목이 없어도 우측 열 폭(--fd-toc-width)을 항상 예약하도록 rail을
        // 렌더한다(enabled=true) → 콘텐츠 가로 위치가 페이지마다 흔들리지 않는다. full(예: Progress
        // Board)은 넓은 폭을 써야 하므로 예외. 라우트가 tableOfContent를 명시하면 그 값이 우선.
        tableOfContent={full ? tableOfContent : { enabled: true, ...tableOfContent }}
        slots={{
          footer: DocsPrevNext,
          toc: {
            provider: TOCProvider,
            main: SeedTableOfContents,
            // 상단 메뉴형 ToC 팝오버는 전 페이지에서 끈다(<xl 모바일·태블릿). 데스크탑(xl+)
            // 우측 레일(SeedTableOfContents)만 유지.
            popover: HiddenTocPopover,
          },
        }}
      >
        {/* 상세 페이지 최상단: 현재 섹션명(좌) + LLMs.txt(우) 한 줄. fumadocs breadcrumb 대체. */}
        <div className="flex flex-row items-center justify-between gap-2 mb-2">
          <SectionLabel />
          {showPageActions ? (llmOptions ?? <LLMOptions markdownUrl={markdownUrl} />) : null}
        </div>
        {/* Match OverviewLayout: unified responsive title size (32/48/60) + Medium weight across
            all doc pages. className overrides fumadocs' default text-[1.75em] via tailwind-merge.
            topSpacing: 섹션 라벨과 제목 사이 간격을 키워 제목·메타·커버가 한 세트로 보이게 한다. */}
        <DocsTitle className={clsx(DOC_TITLE_CLASS, topSpacing && "mt-8 md:mt-14", titleClassName)}>
          {title}
        </DocsTitle>
        {/* text-base (16px) + font-light (300): match description typography across all doc pages (see OverviewLayout/ProsePage).
            className overrides fumadocs' default via tailwind-merge. 설명 미전달 시 렌더 안 함(예: Updates 글). */}
        {description ? (
          <DocsDescription className="text-base font-light">{description}</DocsDescription>
        ) : null}
        {/* 제목·설명 아래(커버 위) 메타. 예: Updates 글의 게시일(우측 정렬). */}
        {meta}
        {platformStatus}
        {/* 커버 썸네일. 탭 페이지도 표시 — meta.json 기반 고정 폴더 커버로, title/desc와 함께 탭 무관 고정 헤더를 이룬다. */}
        {coverImage ? (
          <div className={`not-prose mb-8 md:mb-10${coverClassName ? ` ${coverClassName}` : ""}`}>
            <img
              src={coverImage.src}
              alt={coverImage.alt}
              width={coverImage.width}
              height={coverImage.height}
              className="block h-auto w-full rounded-r4"
              loading="eager"
            />
          </div>
        ) : null}
        {/* 탭형 subject면 커버 아래 sticky 탭 스트립(비탭이면 self-noop null). 탭 클릭 시 스트립이 sticky
            시작 위치로 스크롤 안착 → 고정 헤더는 위로 스크롤되고 본문이 드러난다. */}
        <DocsTabStrip />
        {/* 기본 className은 전 docs 공용. bodyClassName은 전달된 라우트(예: Updates)에서만 append돼
            그 라우트 전용 prose 유틸(소제목·본문 크기/색)을 얹는다(미전달 시 무영향). */}
        <DocsBody
          className={clsx(
            "prose-p:break-keep prose-p:text-pretty prose-headings:text-balance",
            bodyClassName,
          )}
        >
          {children}
        </DocsBody>
      </DocsPage>
      <FooterBand matchContent={!full} />
    </>
  );
}

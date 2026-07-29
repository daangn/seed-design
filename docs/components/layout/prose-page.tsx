import clsx from "clsx";
import { DocsBody } from "fumadocs-ui/page";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";

interface ProsePageProps {
  title: ReactNode;
  description?: ReactNode;
  /** 제목 위 전체폭 하이라이트(커버 이미지 등). main 컬럼 전체 폭(≈헤더 폭)까지 넓게 쓴다. */
  hero?: ReactNode;
  children: ReactNode;
  /** 하단 사이트 footer 표시 (기본 true) */
  footer?: boolean;
  fullHeight?: boolean;
}

/**
 * 사이드바 없는 1컬럼 섹션(get-started, updates, credits)용 콘텐츠 셸.
 * - `[grid-area:main]`을 점유하고 좌우 패딩을 헤더(px-4/6/8)와 맞춘다.
 * - `hero` 슬롯: main 컬럼 전체폭까지 넓게(하이라이트 에셋용).
 * - 제목/본문/footer: 가독성을 위해 1100px로 중앙 정렬.
 * 톤은 OverviewLayout과 맞춘다(DocsBody prose 재사용).
 */
export function ProsePage({
  title,
  description,
  hero,
  children,
  footer = true,
  fullHeight = false,
}: ProsePageProps) {
  return (
    <div className="[grid-area:main] w-full px-4 py-10 md:px-6 md:py-16 xl:px-8">
      {hero ? <div className="mb-10 w-full md:mb-14">{hero}</div> : null}
      <div className="mx-auto w-full max-w-[1100px]">
        <div
          className={clsx(fullHeight && "min-h-[calc(100dvh-104px)] md:min-h-[calc(100dvh-128px)]")}
        >
          <header className="not-prose mb-10 md:mb-14">
            {/* get-started/updates 제목 스케일: text-3xl→md:text-[40px] (데스크탑 40px 고정). */}
            <h1 className="text-fd-foreground text-3xl font-medium tracking-tight text-balance md:text-[40px]">
              {title}
            </h1>
            {description ? (
              <p className="text-fd-muted-foreground mt-4 text-base font-light text-pretty">
                {description}
              </p>
            ) : null}
          </header>
          <DocsBody className="max-w-none prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
            {children}
          </DocsBody>
        </div>
        {footer ? <SiteFooter /> : null}
      </div>
    </div>
  );
}

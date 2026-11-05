import { DocsBody } from "fumadocs-ui/page";
import type { ReactNode } from "react";
import { DOC_TITLE_CLASS } from "./lib/doc-title";

export interface PageCoverImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface OverviewLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  coverImage?: PageCoverImage;
  full?: boolean;
  children: ReactNode;
}

/**
 * Index/Overview 페이지용 자체 레이아웃.
 * 표준 DocsPage(아티클 + TOC) 셸 대신 자체 헤더를 쓰지만, 콘텐츠 폭은 표준 상세와 동일하게
 * 900px로 캡한다(fumadocs `*:max-w-[900px]`와 같은 값). 그래야 ToC 있는 페이지들과 본문 폭이
 * 통일된다. docs 셸(sidebar/navbar)은 상위 DocsLayout이 유지한다.
 * 본문 스타일은 DocsBody(prose)를 재사용해 일반 문서와 톤을 맞춘다.
 */
export function OverviewLayout({
  title,
  description,
  coverImage,
  full,
  children,
}: OverviewLayoutProps) {
  return (
    <div className="[grid-area:main] w-full px-4 py-10 md:px-6 md:py-16 xl:px-8">
      {/* 기본은 표준 상세와 같은 900px 폭, grid-only overview는 full 폭을 사용한다. */}
      <div className={full ? "max-w-none" : "max-w-[900px]"}>
        <header className="not-prose mb-10 md:mb-14">
          {/* Unified doc-page title scale: matches inner pages (DocsTitle) — responsive 32/48/60,
              Medium weight to sit lighter with the new logo. */}
          <h1 className={`text-fd-foreground ${DOC_TITLE_CLASS} text-balance`}>{title}</h1>
          {description ? (
            <p className="text-fd-muted-foreground mt-4 text-base font-light text-pretty">
              {description}
            </p>
          ) : null}
        </header>
        {coverImage ? (
          <div className="not-prose mb-8 md:mb-10">
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
        <DocsBody className="max-w-none prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
          {children}
        </DocsBody>
      </div>
    </div>
  );
}

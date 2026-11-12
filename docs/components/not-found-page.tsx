import { PageLink as Link } from "@/components/link";
import { ActionButton } from "seed-design/ui/action-button";
import { DOCS_PAGE_CONTENT_ID } from "@/components/layout/docs-page-content-id";
import { archivePaths } from "@/lib/docs-archive";

/** 404 본문. `404.astro`가 사이드바 없는 docs 레이아웃 안에 정적으로 그린다. */
export function NotFoundPage() {
  return (
    // Header stays (DocsLayout's header island); the page has no sidebar column
    // so the 404 content centers full-width.
    // The article shell is intentionally omitted: its internal padding pushes content
    // off-center and past 100dvh. The box spans every grid column
    // ([grid-column:1/-1]) so it fills the viewport width instead of being
    // trapped in the narrow main column, and is sized to exactly
    // viewport-minus-header (--fd-header-height) so it fits the row below the
    // header with no vertical scroll.
    <div
      id={DOCS_PAGE_CONTENT_ID}
      className="flex h-[calc(100dvh-var(--fd-header-height,56px))] w-full flex-col items-center justify-center gap-10 overflow-hidden px-4 [grid-column:1/-1]"
    >
      <div className="flex -translate-y-[20px] flex-col items-center gap-10">
        <img
          src={archivePaths.asset("/404.png")}
          alt="404"
          width={300}
          height={106}
          decoding="async"
          className="h-auto w-[216px] md:w-[300px]"
        />

        <h1 className="text-2xl font-medium tracking-tight text-center">
          페이지를 찾을 수 없습니다.
        </h1>

        <ActionButton variant="neutralSolid" size="large" asChild>
          <Link href={archivePaths.prefix ? `${archivePaths.prefix}/` : "/"}>홈으로</Link>
        </ActionButton>
      </div>
    </div>
  );
}

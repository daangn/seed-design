import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

/**
 * SEED 테이블 디자인의 단일 소스.
 *
 * 마크다운 표(mdx-components의 `table` 매핑)와 커스텀 테이블 컴포넌트
 * (token-table / component-variant-table / progress-board-table)가 모두
 * `TableRoot`을 바라본다. 테이블 룩을 바꾸려면 이 파일의 `seedTableChrome`만
 * 수정하면 4곳 전부 함께 바뀐다.
 *
 * 스타일은 descendant selector로 걸어, 안에 들어오는 native
 * `thead/tbody/tr/th/td`를 (마크다운이 생성했든 컴포넌트가 직접 렌더했든)
 * 동일하게 스타일링한다. fumadocs 기본 테이블 규칙은 전부 0-specificity
 * `:where()`라 유틸리티 클래스 하나로 이긴다 → `not-prose` 없이 셀 안
 * 인라인 `code`/`strong`/링크의 fumadocs 스타일은 보존된다.
 */
const seedTableChrome = clsx(
  "w-full border-collapse text-sm text-fg-neutral",
  // 헤더 셀: 세로 보더/배경 제거, 좌측 정렬 기본, 500 굵기
  "[&_th]:border-0 [&_th]:bg-transparent [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-fg-neutral",
  // 본문 셀: 세로 보더 제거, 넉넉한 세로 패딩
  "[&_td]:border-0 [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle",
  // 구분선: 행 하단에만 (헤더 tr=밑줄, 본문 tr=구분선, 마지막 행 포함=하단 마감선)
  "[&_tr]:border-b [&_tr]:border-stroke-neutral-muted",
  // hover: 본문 행에만
  "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-bg-neutral-weak",
  // 셀 안 링크: 상시 밑줄은 제거하고 hover 때만 밑줄 표시
  "[&_a]:no-underline [&_a:hover]:underline",
);

const seedTableWrapper = "relative w-full overflow-x-auto prose-no-margin my-6";

/**
 * 스크롤 주체는 페이지(body)로 남고 헤더만 사이트 헤더 아래에 붙는다. 그러려면 래퍼가
 * 스크롤 컨테이너가 아니어야 한다 — `overflow-x-auto`는 나머지 축까지 `auto`로 계산시켜
 * 래퍼를 스크롤 컨테이너로 만들고, 그러면 안쪽 `thead`의 sticky가 뷰포트 대신 래퍼를
 * 기준으로 잡혀 아무 일도 일어나지 않는다.
 *
 * 스크롤 컨테이너를 걷어내면 가로 스크롤도 같이 사라지므로, 표가 줄바꿈만으로 들어가는
 * 폭에서만 전환한다. 상위 문서 레이아웃이 `overflow-x: clip`이라 넘치면 열이 스크롤바
 * 없이 잘려 접근 자체가 불가능해진다.
 */
const seedStickyHeaderWrapper = "md:overflow-visible";

const seedStickyHeaderChrome = clsx(
  /**
   * 오프셋은 `--fd-docs-row-2`가 아니라 헤더 높이다. row-2는 배너와 헤더가 세로로 쌓인다고
   * 보고 둘을 더하지만, 이 사이트는 배너·헤더가 모두 `sticky top-0`이라 겹쳐서 헤더가 배너를
   * 덮는다. 실제로 비워야 할 높이는 헤더 하나뿐이고, row-2를 쓰면 배너 높이만큼 틈이 생겨
   * 그 사이로 본문 행이 지나간다 (배너가 없는 배포에서는 둘이 같은 값이라 드러나지 않는다).
   */
  "md:[&_thead_th]:sticky md:[&_thead_th]:top-[var(--fd-header-height,4rem)] md:[&_thead_th]:z-10",
  // seedTableChrome의 `[&_th]:bg-transparent`를 이겨, 지나가는 본문 행이 헤더 뒤로 비치지 않게 한다
  "md:[&_thead_th]:bg-bg-layer-default",
  // 구분선은 `[&_tr]:border-b`로 tr에 그려지는데 고정되는 건 th뿐이라 선만 떨어져 스크롤된다. 셀로 옮겨야 헤더를 따라 남는다
  "md:[&_thead_th]:border-b md:[&_thead_th]:border-stroke-neutral-muted",
);

interface TableRootProps extends ComponentPropsWithoutRef<"table"> {
  /** 래퍼 `<div>`에 추가할 클래스 (컨슈머별 레이아웃 확장, 예: 전면 bleed) */
  wrapperClassName?: string;
  /**
   * 헤더 행을 사이트 헤더 아래에 고정한다(`md` 이상). 가로 스크롤을 포기하는 대신이므로,
   * `md` 폭에서 줄바꿈만으로 들어가는 표에만 켠다
   */
  stickyHeader?: boolean;
}

export function TableRoot({
  className,
  wrapperClassName,
  stickyHeader,
  children,
  ...props
}: TableRootProps) {
  return (
    <div
      className={clsx(seedTableWrapper, stickyHeader && seedStickyHeaderWrapper, wrapperClassName)}
    >
      <table
        className={clsx(seedTableChrome, stickyHeader && seedStickyHeaderChrome, className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

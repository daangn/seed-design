import { clsx } from "cn";
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

interface TableRootProps extends ComponentPropsWithoutRef<"table"> {
  /** 래퍼 `<div>`에 추가할 클래스 (컨슈머별 레이아웃 확장, 예: 전면 bleed) */
  wrapperClassName?: string;
}

export function TableRoot({ className, wrapperClassName, children, ...props }: TableRootProps) {
  return (
    <div className={clsx(seedTableWrapper, wrapperClassName)}>
      <table className={clsx(seedTableChrome, className)} {...props}>
        {children}
      </table>
    </div>
  );
}

/**
 * 사이드바 "새 문서" dot — frontmatter `new: true`(lib/new-page.ts)가 붙은 페이지의
 * 라벨 뒤에 붙는다. 색상은 브랜드 캐럿(palette carrot-600) — selection 라임은 라이트
 * 모드 흰 배경에서 대비가 1.4:1 수준이라 dot 크기에선 보이지 않아 교체했다.
 *
 * 데스크톱 사이드바와 모바일 nav 패널이 공유하므로 "use client" 없는 순수 마크업으로 둔다.
 */
export function SidebarNewDot() {
  return (
    <>
      {/* 래퍼가 라인 높이만큼 차지하고 라인박스 상단에 맞춘 뒤 안에서 dot을 수직 중앙 정렬한다.
          `align-middle`은 x-height 기준이라 라인박스 중앙보다 1.3px 처진다. 1.36em은 SEED
          타이포 스케일의 line-height 비율(14/19, 22/30) — `1lh`와 오차 0.1px 미만인데
          구형 사파리에서도 동작한다. */}
      <span
        aria-hidden="true"
        className="ml-1.5 inline-flex h-[1.36em] shrink-0 items-center align-top"
      >
        <span className="size-[7px] rounded-full bg-palette-carrot-600" />
      </span>
      <span className="sr-only">(새 문서)</span>
    </>
  );
}

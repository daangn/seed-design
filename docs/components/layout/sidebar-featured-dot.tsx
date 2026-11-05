/** 사이드바 featured dot. 데스크톱 사이드바와 모바일 nav 패널이 공유한다. */
export function SidebarFeaturedDot() {
  return (
    <>
      {/* 래퍼가 라인 높이를 차지하고 그 안에서 dot을 수직 중앙에 놓는다(`align-middle`은
          x-height 기준이라 1.3px 처진다). 1.36em은 SEED 타이포의 line-height 비율 —
          `1lh`는 iOS 17 이하에서 무효라 dot이 라인 상단으로 튄다. */}
      <span
        aria-hidden="true"
        className="ml-2 inline-flex h-[1.36em] shrink-0 items-center align-top"
      >
        <span className="size-[7px] rounded-full bg-palette-carrot-600" />
      </span>
      <span className="sr-only">추천 문서</span>
    </>
  );
}

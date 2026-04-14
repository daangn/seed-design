# Phase 6: 스크롤/제스처 컴포넌트

Lynx 스크롤 이벤트 모델에 의존하는 컴포넌트들.
lynx-ui-common의 `useBounce`, `useRefresh`, lynx-ui-scroll-view를 핵심 참고.

---

## 1. ScrollFog

**React 소스**: `packages/react/src/components/ScrollFog/ScrollFog.tsx`
**React headless**: `packages/react-headless/scrollable/src/`
**lynx-ui 참고**: `https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-scroll-view/src/`
**Lynx CSS recipe**: `scrollFog`

**Variant Props:**
- `hideScrollBar`: boolean

**Props:**
- `placement?: ("top" | "bottom" | "left" | "right")[]` — default: `["top", "bottom"]`
- `size?: number` — default: 20
- `sizes?: { top?, bottom?, left?, right? }` — 방향별 개별 크기

**웹 동작:**
- 스크롤 가능 영역의 가장자리에 fade-out 안개 효과
- 동적 CSS variables: `--scroll-fog-size-{direction}`, `--scrollable-{direction}`
- 스크롤 위치에 따라 `--scrollable-top`/`--scrollable-bottom`이 0 또는 1로 토글

**Lynx 구현 포인트:**
- Lynx `<scroll-view>` 이벤트로 스크롤 위치 감지
- `onScroll` 또는 `bindscroll` 이벤트
- scrollTop/scrollLeft 값으로 가장자리 도달 여부 계산
- CSS variable 동적 업데이트 → `dynamicStyle()` 또는 main-thread `setStyleProperty`
- lynx-ui-scroll-view 참고: ScrollViewBasic, ScrollViewWithBouncesHook

**성능 고려:**
- 스크롤 이벤트가 빈번하므로 main-thread 실행 권장
- `useRegisteredEvents` (lynx-ui-common)로 이벤트 최적화

- [ ] `src/components/ScrollFog/useScrollFog.ts`
- [ ] `src/components/ScrollFog/ScrollFog.tsx`
- [ ] `docs/content/lynx/components/scroll-fog.mdx`
- [ ] `examples/lynx-spa/src/pages/ScrollFogPage.tsx`

---

## 2. PullToRefresh

**React 소스**: `packages/react/src/components/PullToRefresh/PullToRefresh.tsx`
**React headless**: `packages/react-headless/pull-to-refresh/src/`
**Lynx CSS recipe**: `pullToRefresh` (3슬롯: root, indicator, content)

**Exports:** `PullToRefreshRoot`, `PullToRefreshIndicator`, `PullToRefreshContent`

**웹 headless 동작:**
- `usePullToRefresh()` 훅
- 터치 드래그로 아래로 당기면 indicator 표시
- threshold 초과 시 onPtr 콜백
- `displacementMultiplier`: 당김 감도
- Indicator: render function 패턴 `(props: IndicatorRenderProps) => ReactNode`

**lynx-ui-common 참고:**
- `useRefresh`: `https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-common/src/hooks/useRefresh.ts`
- `useBounce`: 바운스 효과와 통합

**Lynx 구현 포인트:**
- **터치 이벤트 기반**: `bindtouchstart/move/end`로 드래그 감지
- **Lynx `<scroll-view>`와 통합**: 스크롤이 맨 위일 때만 pull-to-refresh 활성화
- **Main-thread 실행**: 부드러운 드래그 피드백을 위해 main-thread 권장
- **Indicator render props**: 드래그 거리, 상태(pulling/refreshing/idle) 전달
- lynx-ui-common의 useRefresh가 이미 검증된 패턴 → 참고 또는 의존

**상태 머신:**
```
idle → pulling (터치 시작)
pulling → triggered (threshold 초과)
triggered → refreshing (onRefresh 호출)
refreshing → idle (완료)
```

**미지원:**
- SVG 기반 spinner indicator (기본 indicator는 CSS로만 구현)

- [ ] `src/components/PullToRefresh/usePullToRefresh.ts`
- [ ] `src/components/PullToRefresh/PullToRefresh.tsx`
- [ ] `docs/content/lynx/components/pull-to-refresh.mdx`
- [ ] `examples/lynx-spa/src/pages/PullToRefreshPage.tsx`

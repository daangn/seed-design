# Phase 6: 스크롤/제스처 컴포넌트

Lynx 스크롤 이벤트 모델에 의존하는 컴포넌트들. **`@lynx-js/lynx-ui-common`의 훅과 `@lynx-js/lynx-ui-scroll-view`를 차용**해 제스처/바운스 로직 재작성을 피한다.

---

## 1. ScrollFog (lynx-ui-scroll-view 래핑)

**React 소스**: `packages/react/src/components/ScrollFog/ScrollFog.tsx`
**래핑 대상**: `@lynx-js/lynx-ui-scroll-view` (`ScrollViewBasic` 32 LOC, `ScrollViewWithBouncesHook` 147 LOC, `index` 236 LOC)
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

**lynx-ui-scroll-view가 담당하는 것:**
- `<scroll-view>` 이벤트 wiring (bounce 포함)
- `useRegisteredEvents`로 스크롤 이벤트 최적화 (lynx-ui-common)
- main-thread 스크롤 콜백

**SEED가 담당하는 것:**
- 스크롤 위치 콜백 받아서 `--scrollable-{top|bottom|left|right}` CSS variable 갱신 (`dynamicStyle()` 또는 main-thread `setStyleProperty`)
- placement/size/sizes props → recipe `scrollFog` 슬롯 매핑
- `hideScrollBar` variant

**성능 고려:**
- 스크롤 이벤트가 빈번하므로 main-thread 실행. `useRegisteredEvents`는 lynx-ui-common에서 그대로 사용.

- [ ] `src/components/ScrollFog/ScrollFog.tsx`
- [ ] `docs/content/lynx/components/scroll-fog.mdx`
- [ ] `examples/lynx-spa/src/pages/ScrollFogPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-scroll-view`, `@lynx-js/lynx-ui-common`

---

## 2. PullToRefresh (lynx-ui-common.useRefresh 활용)

**React 소스**: `packages/react/src/components/PullToRefresh/PullToRefresh.tsx`
**차용 대상**: `@lynx-js/lynx-ui-common` — [`useRefresh`](https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-common/src/hooks/useRefresh.tsx)
**Lynx CSS recipe**: `pullToRefresh` (3슬롯: root, indicator, content)

**Exports:** `PullToRefreshRoot`, `PullToRefreshIndicator`, `PullToRefreshContent`

**lynx-ui-common.useRefresh가 담당하는 것:**
- 터치 드래그 → pulling → triggered → refreshing → idle 상태 머신
- `<scroll-view>` 통합 (최상단에서만 활성)
- Main-thread 실행으로 부드러운 드래그 피드백
- displacement multiplier, threshold 파라미터

**SEED가 담당하는 것:**
- `PullToRefreshRoot`: `useRefresh` 훅을 내부에서 호출해 스크롤 뷰 wiring
- `PullToRefreshIndicator`: **spinner SVG 없이 CSS 애니메이션으로 구현**
  - 상태별 클래스(`data-state="pulling|triggered|refreshing"`)로 스타일 분기
  - 인디케이터는 CSS `transform` + `@keyframes`로 회전/펄스 등 표현
- `PullToRefreshContent`: 스크롤 대상 영역

**render props 유지:**
- `IndicatorRenderProps: { state, pullDistance, progress }` 형태로 커스텀 렌더러 허용 (웹 API와 일치)

**미지원 / 대안:**
- SVG 기반 spinner 기본 인디케이터 → CSS-only 애니메이션으로 대체 (Lynx 3.7 SVG 시 기본 인디케이터 교체 검토)

- [ ] `src/components/PullToRefresh/PullToRefresh.tsx`
- [ ] `docs/content/lynx/components/pull-to-refresh.mdx`
- [ ] `examples/lynx-spa/src/pages/PullToRefreshPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-common`

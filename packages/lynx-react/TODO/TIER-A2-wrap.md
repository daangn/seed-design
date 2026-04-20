# Tier A2: lynx-ui 래핑

복잡한 제스처·스프링 물리·프레즌스 상태 머신·플로팅 포지셔닝 로직을 [lynx-ui](https://github.com/lynx-family/lynx-ui)에서 가져온다. SEED는 컴포넌트 API와 스타일만 담당.

**공통 규칙:**
- `packages/lynx-react/package.json`의 `peerDependencies`에 사용하는 `@lynx-js/lynx-ui-*` 패키지를 등록한다.
- 컴포넌트 JSDoc에 `@platform Lynx`로 내부적으로 어떤 lynx-ui 패키지를 감싸는지 명시한다.
- SEED 공개 API는 웹(`@seed-design/react`)과 이름을 일치시킨다. **lynx-ui API 누출 금지.**

**구현 순서** (당장 필요한 것 → 추가 가치 있는 것):

1. [BottomSheet](#1-bottomsheet) ← 우선 착수
2. [Dialog](#2-dialog)
3. [MenuSheet](#3-menusheet)
4. [Popover / HelpBubble](#4-popover--helpbubble)
5. [PullToRefresh](#5-pulltorefresh)
6. [ScrollFog](#6-scrollfog)

---

## 1. BottomSheet (lynx-ui-sheet 래핑) — 우선 착수

**React 소스**: `packages/react/src/components/BottomSheet/BottomSheet.tsx`
**래핑 대상**: `@lynx-js/lynx-ui-sheet` (~1,500 LOC: `useSnap`, `useSheetController`, `useSnapTouches`, `useSheetPresence`, `useDrag` 5개 훅)
**Lynx CSS recipe**: `bottomSheet`

**Exports:** `BottomSheetRoot`, `BottomSheetTrigger`, `BottomSheetBackdrop`, `BottomSheetContent`, `BottomSheetHandle`, `BottomSheetHeader`, `BottomSheetTitle`, `BottomSheetDescription`, `BottomSheetBody`, `BottomSheetFooter`

**lynx-ui-sheet가 담당하는 것:**
- Snap points (여러 높이 스냅, 기본 snap animation은 spring)
- Drag-to-close / drag-to-expand, fling 감속, rubber band
- Claimed gesture angles (수직 드래그만 시트에 할당, 가로 스크롤과 충돌 방지)
- `ref.snapTo(idx)`, `.expand()`, `.collapse()`, `.close()`, `.open()` imperative API
- Presence 상태 머신 (mount/unmount 애니메이션)

**SEED가 담당하는 것:**
- SEED 공개 API(웹과 동일한 compound 이름)로 매핑:
  - `BottomSheetRoot` → `SheetRoot` (+ controlled/uncontrolled props, `lazyMount`, `unmountOnExit`, `snapPoints` 등 SEED 네임으로 변환)
  - `BottomSheetBackdrop` → `SheetBackdrop` + recipe `backdrop` 슬롯
  - `BottomSheetContent` → `SheetContent` + recipe `content` 슬롯
  - `BottomSheetHandle` → `SheetHandle` + recipe `handle` 슬롯
  - `BottomSheetHeader/Title/Description/Body/Footer` → 구조 `<view>`/`<text>` + recipe 각 슬롯
- `BottomSheetTrigger` 처리: 웹은 Radix 기반 trigger → Lynx 래퍼는 `bindtap`으로 내부 ref에 `.open()` 호출
- SEED 고유 `snapPoints` 기본값·가이드라인 문서화

**Tier B 분리:**
- `BottomSheetCloseButton` (별도 컴포넌트 — SVG 아이콘 필요)

- [ ] `src/components/BottomSheet/BottomSheet.tsx`
- [ ] `docs/content/lynx/components/bottom-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/BottomSheetPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-sheet`

---

## 2. Dialog (lynx-ui-dialog 래핑)

**React 소스**: `packages/react/src/components/Dialog/Dialog.tsx`
**래핑 대상**: `@lynx-js/lynx-ui-dialog` (`Dialog.tsx` 295 LOC, `DialogButton.tsx` 56 LOC, `DialogContext.tsx` 26 LOC)
**Lynx CSS recipe**: `dialog` (7슬롯: positioner, backdrop, content, header, title, description, footer)

**Exports:** `DialogRoot`, `DialogTrigger`, `DialogBackdrop`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogAction`

**lynx-ui-dialog가 담당하는 것:**
- `usePresenceGroup`: Entering/Entered/Leaving/Left 상태 머신
- `presenceClassVariants()`: 애니메이션 CSS 클래스
- `OverlayView`: 오버레이 포지셔닝
- Backdrop tap → close
- Busy state (애니메이션 중 인터랙션 차단)

**SEED가 담당하는 것:**
- `DialogRoot` → `<lynxui.DialogRoot>`에 SEED recipe(`dialog.positioner/backdrop/content/...`) 입힘
- 공개 API 이름을 `@seed-design/react`와 일치 (`lazyMount`, `unmountOnExit`, `onOpenChange` 등)
- `DialogAction` 같은 SEED 고유 compound 추가

**Tier B 분리:**
- `DialogCloseButton` (SVG 아이콘 필요)
- FocusScope, Escape key, DismissableLayer(키보드) 는 Lynx 모바일에서 불필요

- [ ] `src/components/Dialog/Dialog.tsx`
- [ ] `docs/content/lynx/components/dialog.mdx`
- [ ] `examples/lynx-spa/src/pages/DialogPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-dialog`

---

## 3. MenuSheet (lynx-ui-sheet 또는 lynx-ui-dialog 래핑)

**React 소스**: `packages/react/src/components/MenuSheet/MenuSheet.tsx`
**래핑 대상**: 디자인 확인 후 결정. 모바일에서 바텀 시트 스타일로 뜬다면 `@lynx-js/lynx-ui-sheet`, 정적 오버레이면 `@lynx-js/lynx-ui-dialog`.
**Lynx CSS recipes**: `menuSheet`, `menuSheetItem`

**Exports:** `MenuSheetRoot`, `MenuSheetTrigger`, `MenuSheetBackdrop`, `MenuSheetContent`, `MenuSheetHeader`, `MenuSheetTitle`, `MenuSheetDescription`, `MenuSheetList`, `MenuSheetGroup`, `MenuSheetItem`, `MenuSheetItemContent`, `MenuSheetItemLabel`, `MenuSheetItemDescription`, `MenuSheetFooter`

**Lynx 구현 포인트:**
- Dialog 또는 BottomSheet 래핑을 베이스로 MenuSheet 슬롯 추가
- `MenuSheetItem`: `bindtap`으로 아이템 선택 (SEED 컴포넌트 레벨에서 처리)
- 많은 sub-component → Context로 variant 전파

**Tier B 분리:**
- `MenuSheetCloseButton` (SVG 아이콘 필요)

- [ ] `src/components/MenuSheet/MenuSheet.tsx`
- [ ] `docs/content/lynx/components/menu-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/MenuSheetPage.tsx`

---

## 4. Popover / HelpBubble (lynx-ui-popover 래핑)

**React 소스**: `packages/react/src/components/HelpBubble/HelpBubble.tsx`
**래핑 대상**: `@lynx-js/lynx-ui-popover` (~2,347 LOC: `floating/` 5개 파일, `Popover.tsx`, `useElementInfoReducer.tsx`)
**Lynx CSS recipe**: `helpBubble`

**Exports:** `HelpBubbleRoot`, `HelpBubbleTrigger`, `HelpBubbleContent`, `HelpBubbleTitle`, `HelpBubbleDescription`

**lynx-ui-popover가 담당하는 것:**
- anchor tracking (플로팅 UI가 타겟 요소 위치 추적)
- `floating/offset`, `floating/shift`, `floating/size` 미들웨어 (floating-ui 포트)
- `useElementInfoReducer`: 엘리먼트 측정 및 포지션 계산
- overlay / presence 통합

**SEED가 담당하는 것:**
- SEED 공개 API 이름 정합 (`@seed-design/react`의 HelpBubble과 동일한 compound)
- recipe `helpBubble` 슬롯 매핑
- placement 기본값 및 SEED 가이드라인 반영

**Tier B 분리:**
- 아이콘이 들어간 트리거(물음표 아이콘 등) — SVG 필요

- [ ] `src/components/HelpBubble/HelpBubble.tsx`
- [ ] `docs/content/lynx/components/help-bubble.mdx`
- [ ] `examples/lynx-spa/src/pages/HelpBubblePage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-popover`

---

## 5. PullToRefresh (lynx-ui-common.useRefresh 활용)

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

---

## 6. ScrollFog (lynx-ui-scroll-view 래핑)

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

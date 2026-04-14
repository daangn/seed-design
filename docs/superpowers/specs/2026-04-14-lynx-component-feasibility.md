# Lynx Component Feasibility Analysis

## Context

Lynx 플랫폼용 SEED Design 컴포넌트를 제작해야 한다. Lynx는 SVG를 지원하지 않으므로, `packages/react`의 웹 컴포넌트 중 SVG 의존 없이 구현 가능한 컴포넌트를 식별한다.

**기준:**
- `packages/react/src/components/`의 69개 컴포넌트 대상
- 레이아웃 컴포넌트 제외 (별도 구현 완료)
- 이미 origin/lynx에 구현된 컴포넌트 제외 (ActionButton, ProgressCircle)
- SVG를 사용하는 컴포넌트는 모두 제외 (선택적 사용 포함)

**기술 제약:**
- SVG 미지원 (Lynx 3.7까지)
- CSS `inherit` 미지원 → 직접 값 지정으로 대체 가능
- clip-path 애니메이션 불가
- `<button>` 등 HTML 시맨틱 요소 없음 → `<view>`/`<text>` 사용
- `onClick` → `bindtap`
- Primitive.view 사용 시 BackgroundSnapshot 에러 → 네이티브 `<view>` 직접 사용

---

## 제외 대상

### 레이아웃 컴포넌트 (11개)

Box, Flex, Grid, GridItem, Stack, Columns, Inline, Float, AspectRatio, ResponsivePair, ConsistentWidth

### 이미 구현됨 (2개)

ActionButton, ProgressCircle

### SVG 필수 — 구현 불가 (14개)

| 컴포넌트 | SVG 의존 상세 |
|----------|-------------|
| Checkbox | CheckboxIndicator가 체크/인디터미네이트 SVG 렌더링 |
| RadioGroup | RadioGroupItemIndicator가 `<svg><circle>` 기본 렌더링 |
| RadioGroupField | RadioGroup에 의존 |
| Field | FieldRequiredIndicator가 인라인 SVG 별표 |
| Fieldset | FieldsetRequiredIndicator가 인라인 SVG 별표 |
| FieldButton | RequiredIndicator SVG + PrefixIcon/SuffixIcon |
| Icon | SVG 래퍼 컴포넌트 |
| ContentPlaceholder | 12개 프리셋 일러스트 SVG 하드코딩 |
| IdentityPlaceholder | business/person 아이덴티티 SVG |
| HelpBubble | SVG path로 말풍선 화살표 팁 렌더링 |
| FloatingActionButton | FAB Icon 슬롯이 SVG 기반 |
| LoadingIndicator | SVG/애니메이션 인디케이터 필수 |
| ActionChip | `layout="iconOnly"` 시 SVG 필수 |
| Chip | `layout="iconOnly"` 시 SVG 필수 |

### SVG 선택적 — 제외 (4개)

| 컴포넌트 | SVG 사용 부분 |
|----------|-------------|
| TextField | PrefixIcon/SuffixIcon (InternalIcon) |
| Snackbar | PrefixIcon (InternalIcon) |
| SelectBox | CheckSelectBox 체크마크 (InternalIcon) |
| Slider | ValueIndicatorArrowTip (SVG path) |

> Note: FloatingActionButton은 SVG 필수 목록에 포함 (Icon 슬롯이 핵심 기능)

---

## 구현 가능 목록 (38개)

### 버튼/컨트롤 (6개)

| 컴포넌트 | 설명 |
|----------|------|
| ToggleButton | 토글 상태 버튼 |
| ReactionButton | 리액션(좋아요 등) 버튼 |
| ContextualFloatingButton | 컨텍스트 플로팅 버튼 |
| ControlChip | 컨트롤 칩 |
| ExtendedFab | 확장형 FAB (텍스트 포함) |
| Fab | 기본 FAB |

### 입력/폼 (3개)

| 컴포넌트 | 설명 |
|----------|------|
| Switch | 토글 스위치 |
| SegmentedControl | 세그먼트 컨트롤 |
| ChipTabs | 칩 형태 탭 |

### 표시 (6개)

| 컴포넌트 | 설명 |
|----------|------|
| Text | 텍스트 표시 |
| Badge | 배지 |
| Count | 카운트 표시 |
| Avatar | 아바타 이미지 |
| ImageFrame | 이미지 프레임 |
| NotificationBadge | 알림 배지 |

### 대화상자/시트 (6개)

| 컴포넌트 | 설명 |
|----------|------|
| Dialog | 다이얼로그 |
| BottomSheet | 바텀시트 |
| BottomSheetHandle | 바텀시트 핸들 |
| MenuSheet | 메뉴시트 |
| ExtendedActionSheet | 확장 액션시트 |
| ActionSheet | 액션시트 |

### 배너/메시지 (3개)

| 컴포넌트 | 설명 |
|----------|------|
| InlineBanner | 인라인 배너 |
| PageBanner | 페이지 배너 |
| Callout | 콜아웃 |

### 리스트/콘텐츠 (7개)

| 컴포넌트 | 설명 |
|----------|------|
| List | 리스트 |
| TagGroup | 태그 그룹 |
| Article | 아티클 |
| LinkContent | 링크 콘텐츠 |
| Skeleton | 스켈레톤 로딩 |
| ScrollFog | 스크롤 포그 |
| PullToRefresh | 풀투리프레시 |

### 유틸리티 (3개)

| 컴포넌트 | 설명 |
|----------|------|
| Portal | 포탈 |
| VisuallyHidden | 시각적 숨김 |
| Divider | 구분선 |

### 특수 (4개)

| 컴포넌트 | 설명 |
|----------|------|
| Tabs | 탭 네비게이션 |
| Celsius | 온도 표시 |
| MannerTemp | 매너온도 |
| MannerTempBadge | 매너온도 배지 |

---

## 추가 고려사항

### MannerTemp 계열

MannerTemp, MannerTempBadge는 SVG를 직접 사용하지 않지만, MannerTempEmote가 이모지/이미지를 사용할 수 있음. 구현 시 확인 필요.

### Dialog/Sheet 계열

Lynx에서 overlay/portal 동작이 웹과 다를 수 있음. Dialog, BottomSheet, MenuSheet, ActionSheet 등은 Lynx의 팝업/오버레이 API에 맞춰 구현해야 할 수 있음.

### PullToRefresh / ScrollFog

스크롤 관련 컴포넌트는 Lynx의 스크롤 이벤트 모델에 의존. 구현 가능하나 웹과 동작이 다를 수 있음.

---

## 아키텍처 결정

### 접근 방식: 플랫 (B)

`lynx-react`에서 상태 + 스타일을 직접 처리한다. 별도 `lynx-headless` 패키지를 두지 않는다.

**이유:**
- Lynx 3.6은 `[data-*]` CSS selector를 지원하지 않음 → 웹 headless의 `data-*` attribute 패턴 사용 불가
- Lynx CSS recipe가 className 기반 variant 매핑을 이미 해결 (`.seed-X--variant_Y`)
- 복잡한 상태 로직은 같은 패키지 내 `use*.ts` 훅으로 추출
- ActionButton 패턴이 이미 origin/lynx에서 검증됨

**컴포넌트 구조:**
```
lynx-react/src/
├── utils/
│   ├── use-controllable-state.ts   ← 직접 구현
│   ├── use-press-tap.ts            ← lynx-ui-switch 참고해서 직접 구현
│   ├── dynamic-style.ts            ← 기존 유지
│   └── ...
├── components/
│   ├── Switch/
│   │   ├── useSwitch.ts            ← 상태 로직 (utils 훅 사용)
│   │   ├── Switch.tsx              ← recipe className + useSwitch
│   │   └── index.ts
│   ├── Badge/
│   │   ├── Badge.tsx               ← recipe만으로 충분
│   │   └── index.ts
│   └── ...
```

### 의존성 전략

| 유틸/훅 | 소스 | 이유 |
|---------|------|------|
| `useLatest`, `useMemoizedFn`, `usePrevious` 등 | `lynx-ui-common` (dependency) | 범용 유틸, Lynx에서 검증됨 |
| `useControllableState` | 직접 구현 | lynx-ui-common에 없음, 우리 패턴에 맞게 |
| `usePressTap` | 직접 구현 (lynx-ui-switch 참고) | 우리 recipe/인터페이스에 맞게 커스텀 |
| recipe `splitVariantProps` | `@seed-design/lynx-css` | 기존 생성물 사용 |
| `clsx` | 외부 의존성 | 기존 사용 중 |

### 스타일링 패턴

```typescript
// 웹 (data-* attribute)
<div data-checked={dataAttr(isChecked)} data-disabled={dataAttr(disabled)} />
// CSS: [data-checked] { ... }

// Lynx (className variant)
<view className={recipe({ checked: true, disabled: true }).root} />
// CSS: .seed-switch--checked_true { ... }
```

---

## 구현 로드맵

### Phase 0: 인프라 및 공통 유틸

컴포넌트 구현 전에 공통 기반을 먼저 깐다.

**작업 항목:**

| 항목 | 설명 | 참고 |
|------|------|------|
| `lynx-ui-common` dependency 추가 | `packages/lynx-react/package.json`에 추가 | `useLatest`, `useMemoizedFn`, `usePrevious` 등 |
| `useControllableState` 구현 | `lynx-react/src/utils/use-controllable-state.ts` | lynx-ui-switch의 인라인 패턴 참고 |
| `usePressTap` 구현 | `lynx-react/src/utils/use-press-tap.ts` | `/Documents/GitHub/lynx-ui/packages/lynx-ui-switch/src/use-press-tap.ts` 참고 |
| `dynamicStyle` 확인 | 이미 `lynx-react/src/utils/dynamic-style.ts`에 있음 | 기존 유지 |
| `getSeedClassName` 확인 | 이미 `lynx-react/src/utils/get-seed-class-name.ts`에 있음 | 기존 유지 |

**산출물:**
- `docs/content/lynx/hooks/use-controllable-state.mdx`
- `docs/content/lynx/hooks/use-press-tap.mdx`

---

### Phase 1: 단순 표시 컴포넌트 (상태 없음)

variant/size props만 받아 className을 생성하는 가장 단순한 컴포넌트들.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | Text | `text` | `react/src/components/Text/` | - | - |
| 2 | Badge | `badge` | `react/src/components/Badge/` | - | - |
| 3 | Count | - (React only) | `react/src/components/Count/` | - | - |
| 4 | Divider | - (React only) | `react/src/components/Divider/` | - | - |
| 5 | NotificationBadge | `notification-badge` | `react/src/components/NotificationBadge/` | - | - |
| 6 | Skeleton | `skeleton` | `react/src/components/Skeleton/` | - | - |
| 7 | Celsius | - (React only) | `react/src/components/Celsius/` | - | - |
| 8 | MannerTemp | `manner-temp` | `react/src/components/MannerTemp/` | - | - |
| 9 | MannerTempBadge | `manner-temp-badge` | `react/src/components/MannerTempBadge/` | - | - |
| 10 | VisuallyHidden | - (React only) | `react/src/components/VisuallyHidden/` | - | - |

**패턴:** ActionButton과 동일. `recipe.splitVariantProps()` → `clsx(classes.root)` → `<view>`/`<text>` 렌더링.

**산출물 (각 컴포넌트당):**
- `lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
- `docs/content/lynx/components/{kebab-name}.mdx`
- `examples/lynx-spa/src/pages/{Name}Page.tsx`

---

### Phase 2: 단순 인터랙티브 컴포넌트 (tap 이벤트)

bindtap 이벤트만 처리하면 되는 버튼/칩 계열.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | ToggleButton | `toggle-button` | `react/src/components/ToggleButton/` | - | `react-headless/toggle/` |
| 2 | ReactionButton | `reaction-button` | `react/src/components/ReactionButton/` | - | - |
| 3 | ControlChip | `control-chip` | `react/src/components/ControlChip/` | - | - |
| 4 | Fab | `fab` | `react/src/components/Fab/` | - | - |
| 5 | ExtendedFab | `extended-fab` | `react/src/components/ExtendedFab/` | - | - |
| 6 | ContextualFloatingButton | `contextual-floating-button` | `react/src/components/ContextualFloatingButton/` | - | - |

**패턴:** ActionButton + `usePressTap` 훅으로 pressed 상태 관리. `bindtap`/`main-thread:bindtap` 이벤트 핸들러.

**산출물:** Phase 1과 동일 구조.

---

### Phase 3: 상태 관리 컴포넌트 (controlled/uncontrolled)

내부 상태를 갖고 controlled/uncontrolled 패턴이 필요한 컴포넌트들.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | Switch | `switch`, `switchmark` | `react/src/components/Switch/` | **lynx-ui-switch** | `react-headless/switch/` |
| 2 | ChipTabs | `chip-tabs` | `react/src/components/ChipTabs/` | - | - |
| 3 | Tabs | `tabs` | `react/src/components/Tabs/` | - | `react-headless/tabs/` |
| 4 | SegmentedControl | `segmented-control` | `react/src/components/SegmentedControl/` | - | `react-headless/segmented-control/` |
| 5 | TagGroup | `tag-group`, `tag-group-item` | `react/src/components/TagGroup/` | - | - |

**패턴:** `useControllableState` + `usePressTap` 사용. Compound component 패턴 (Root/Item).

**참고 파일:**
- Switch: `/Documents/GitHub/lynx-ui/packages/lynx-ui-switch/src/switch.tsx` (controlled 패턴, compound component 참고)
- SegmentedControl: `react-headless/segmented-control/src/useSegmentedControl.ts` (getItemProps 패턴)
- Tabs: `react-headless/tabs/src/` (13개 파일, 가장 큰 headless)

**산출물:** Phase 1과 동일 구조 + 각 컴포넌트 내부 `use{Name}.ts` 훅 파일.

---

### Phase 4: 콘텐츠/리스트 컴포넌트

복합 구조를 갖지만 상태 관리는 단순한 컴포넌트들.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | List | `list-item`, `list-header` | `react/src/components/List/` | **lynx-ui-list** | - |
| 2 | Article | `article` | `react/src/components/Article/` | - | - |
| 3 | LinkContent | `link-content` | `react/src/components/LinkContent/` | - | - |
| 4 | Avatar | `avatar` | `react/src/components/Avatar/` | - | `react-headless/avatar/` |
| 5 | ImageFrame | `image-frame` | `react/src/components/ImageFrame/` | - | - |
| 6 | InlineBanner | `inline-banner` | `react/src/components/InlineBanner/` | - | - |
| 7 | PageBanner | `page-banner` | `react/src/components/PageBanner/` | - | - |
| 8 | Callout | `callout` | `react/src/components/Callout/` | - | - |

**패턴:** Compound component (Root/Content/Title 등). Slot recipe로 각 파트에 className 부여.

**참고 파일:**
- List: `/Documents/GitHub/lynx-ui/packages/lynx-ui-list/` (Lynx 스크롤 리스트 패턴)

**산출물:** Phase 1과 동일 구조.

---

### Phase 5: 오버레이/시트 컴포넌트

포탈, 오버레이, 애니메이션이 필요한 복잡 컴포넌트들.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | Portal | - (React only) | `react/src/components/Portal/` | - | `react-headless/portal/` |
| 2 | Dialog | `dialog` | `react/src/components/Dialog/` | **lynx-ui-dialog** | `react-headless/dialog/` |
| 3 | BottomSheet | `bottom-sheet` | `react/src/components/BottomSheet/` | **lynx-ui-sheet** | - |
| 4 | BottomSheetHandle | `bottom-sheet-handle` | `react/src/components/BottomSheetHandle/` | **lynx-ui-sheet** | - |
| 5 | ActionSheet | `action-sheet` | `react/src/components/ActionSheet/` | - | - |
| 6 | ExtendedActionSheet | `extended-action-sheet` | `react/src/components/ExtendedActionSheet/` | - | - |
| 7 | MenuSheet | `menu-sheet` | `react/src/components/MenuSheet/` | - | - |

**패턴:** 오버레이 레이어 관리 + 애니메이션 (lynx-ui-presence 참고). Backdrop + Content compound.

**참고 파일:**
- Dialog: `/Documents/GitHub/lynx-ui/packages/lynx-ui-dialog/src/` (Presence 애니메이션, overlay 패턴)
- Sheet: `/Documents/GitHub/lynx-ui/packages/lynx-ui-sheet/` (드래그 제스처, 시트 애니메이션)
- Overlay: `/Documents/GitHub/lynx-ui/packages/lynx-ui-overlay/` (포지셔닝)
- Presence: `/Documents/GitHub/lynx-ui/packages/lynx-ui-presence/` (애니메이션 상태 머신)

**산출물:** Phase 1과 동일 구조.

---

### Phase 6: 스크롤/제스처 컴포넌트

Lynx 스크롤 이벤트 모델에 의존하는 컴포넌트들.

| # | 컴포넌트 | Lynx CSS recipe | React 소스 | lynx-ui 참고 | Headless |
|---|---------|----------------|-----------|-------------|---------|
| 1 | ScrollFog | `scroll-fog` | `react/src/components/ScrollFog/` | **lynx-ui-scroll-view** | `react-headless/scrollable/` |
| 2 | PullToRefresh | `pull-to-refresh` | `react/src/components/PullToRefresh/` | - | `react-headless/pull-to-refresh/` |

**패턴:** Lynx `<scroll-view>` 네이티브 이벤트 활용. lynx-ui-common의 `useBounce`, `useRefresh` 참고.

**참고 파일:**
- ScrollView: `/Documents/GitHub/lynx-ui/packages/lynx-ui-scroll-view/`
- Common bounce/refresh: `/Documents/GitHub/lynx-ui/packages/lynx-ui-common/src/hooks/useBounce.tsx`

**산출물:** Phase 1과 동일 구조.

---

## 컴포넌트별 상세 참조 맵

### 전체 참조 파일 매핑

| 컴포넌트 | React styled | React headless | Lynx-UI 참고 | Lynx CSS recipe |
|----------|-------------|---------------|-------------|----------------|
| Text | `react/src/components/Text/` | - | - | `text` |
| Badge | `react/src/components/Badge/` | - | - | `badge` |
| Count | `react/src/components/Count/` | - | - | - |
| Divider | `react/src/components/Divider/` | - | - | - |
| NotificationBadge | `react/src/components/NotificationBadge/` | - | - | `notification-badge` |
| Skeleton | `react/src/components/Skeleton/` | - | - | `skeleton` |
| Celsius | `react/src/components/Celsius/` | - | - | - |
| MannerTemp | `react/src/components/MannerTemp/` | - | - | `manner-temp` |
| MannerTempBadge | `react/src/components/MannerTempBadge/` | - | - | `manner-temp-badge` |
| VisuallyHidden | `react/src/components/VisuallyHidden/` | - | - | - |
| ToggleButton | `react/src/components/ToggleButton/` | `react-headless/toggle/` | - | `toggle-button` |
| ReactionButton | `react/src/components/ReactionButton/` | - | - | `reaction-button` |
| ControlChip | `react/src/components/ControlChip/` | - | - | `control-chip` |
| Fab | `react/src/components/Fab/` | - | - | `fab` |
| ExtendedFab | `react/src/components/ExtendedFab/` | - | - | `extended-fab` |
| ContextualFloatingButton | `react/src/components/ContextualFloatingButton/` | - | - | `contextual-floating-button` |
| Switch | `react/src/components/Switch/` | `react-headless/switch/` | `lynx-ui-switch` | `switch`, `switchmark` |
| ChipTabs | `react/src/components/ChipTabs/` | - | - | `chip-tabs` |
| Tabs | `react/src/components/Tabs/` | `react-headless/tabs/` | - | `tabs` |
| SegmentedControl | `react/src/components/SegmentedControl/` | `react-headless/segmented-control/` | - | `segmented-control` |
| TagGroup | `react/src/components/TagGroup/` | - | - | `tag-group` |
| List | `react/src/components/List/` | - | `lynx-ui-list` | `list-item`, `list-header` |
| Article | `react/src/components/Article/` | - | - | `article` |
| LinkContent | `react/src/components/LinkContent/` | - | - | `link-content` |
| Avatar | `react/src/components/Avatar/` | `react-headless/avatar/` | - | `avatar` |
| ImageFrame | `react/src/components/ImageFrame/` | - | - | `image-frame` |
| InlineBanner | `react/src/components/InlineBanner/` | - | - | `inline-banner` |
| PageBanner | `react/src/components/PageBanner/` | - | - | `page-banner` |
| Callout | `react/src/components/Callout/` | - | - | `callout` |
| Portal | `react/src/components/Portal/` | `react-headless/portal/` | - | - |
| Dialog | `react/src/components/Dialog/` | `react-headless/dialog/` | `lynx-ui-dialog` | `dialog` |
| BottomSheet | `react/src/components/BottomSheet/` | - | `lynx-ui-sheet` | `bottom-sheet` |
| BottomSheetHandle | `react/src/components/BottomSheetHandle/` | - | `lynx-ui-sheet` | `bottom-sheet-handle` |
| ActionSheet | `react/src/components/ActionSheet/` | - | - | `action-sheet` |
| ExtendedActionSheet | `react/src/components/ExtendedActionSheet/` | - | - | `extended-action-sheet` |
| MenuSheet | `react/src/components/MenuSheet/` | - | - | `menu-sheet` |
| ScrollFog | `react/src/components/ScrollFog/` | `react-headless/scrollable/` | `lynx-ui-scroll-view` | `scroll-fog` |
| PullToRefresh | `react/src/components/PullToRefresh/` | `react-headless/pull-to-refresh/` | - | `pull-to-refresh` |

---

## 산출물 체크리스트

### 각 컴포넌트당 필요한 파일

1. **구현**: `packages/lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
2. **문서**: `docs/content/lynx/components/{kebab-name}.mdx`
3. **카탈로그**: `examples/lynx-spa/src/pages/{Name}Page.tsx`
4. **라우팅**: `examples/lynx-spa/src/App.tsx`에 페이지 등록
5. **메타**: `docs/content/lynx/components/meta.json`에 등록

### 훅 문서

- `docs/content/lynx/hooks/use-controllable-state.mdx`
- `docs/content/lynx/hooks/use-press-tap.mdx`

---

## 요약

| 구분 | 개수 |
|------|------|
| 전체 컴포넌트 | 69 |
| 레이아웃 제외 | -11 |
| 이미 구현됨 | -2 |
| SVG 필수 제외 | -14 |
| SVG 선택적 제외 | -4 |
| **구현 가능** | **38** |

### Phase별 컴포넌트 수

| Phase | 내용 | 컴포넌트 수 |
|-------|------|-----------|
| 0 | 인프라 및 공통 유틸 | - |
| 1 | 단순 표시 (상태 없음) | 10 |
| 2 | 단순 인터랙티브 (tap) | 6 |
| 3 | 상태 관리 (controlled) | 5 |
| 4 | 콘텐츠/리스트 | 8 |
| 5 | 오버레이/시트 | 7 |
| 6 | 스크롤/제스처 | 2 |
| **합계** | | **38** |

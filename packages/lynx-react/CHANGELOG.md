# @seed-design/lynx-react

## 0.2.0-alpha.2

### Minor Changes

- 79a951d: Lynx Checkbox / RadioGroup 컴포넌트 추가

  - `@seed-design/lynx-react` 에 `Checkbox` (Root/Control/Indicator/Label/Group), `RadioGroup` (Root/Item/ItemControl/ItemIndicator/ItemLabel) compound 컴포넌트 추가
  - `@seed-design/qvism-preset` 에 `checkbox`, `checkmark`, `checkbox-group`, `radio`, `radiomark`, `radio-group` Lynx recipe 6개 추가
  - Lynx-전용 recipe 에서 `checked`/`disabled`/`indeterminate` 를 pseudo selector 대신 boolean variants 로 직접 선언 (qvism 의 `StringToBoolean` 을 활용해 타입 cast 없이 사용 가능)
  - `CheckboxIndicator` / `RadioGroupItemIndicator` 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를 받아 `cloneElement` + `useIconColor` 패턴으로 `<image tint-color=...>` 의 색상을 recipe CSS `color` 토큰과 동기화
  - 웹 대비 미지원 기능 (HiddenInput, form field props, focus/focusVisible, raw `onChange`, deprecated `weight="default"/"stronger"`) 은 JSDoc 에 명시

### Patch Changes

- a2ce202: Lynx Bottom Sheet의 `skipAnimation`이 열림/닫힘 애니메이션을 실제로 건너뛰도록 수정합니다.
- 9b3f96d: Lynx `ProgressCircle`에서 `size` 변경이 애니메이션에 즉시 반영되도록 수정합니다.

  - 같은 `ProgressCircle` 인스턴스에서 `size`가 변경될 때 이전 크기의 애니메이션 geometry가 남지 않도록 개선합니다.

- 1db5419: Lynx `ActionButton`의 `loading` 상태에서 버튼 너비가 spinner 크기로 줄어드는 문제를 수정합니다.

  - `loading` 상태에서도 기존 label/icon 영역의 너비를 유지한 채 spinner를 표시합니다.
  - `ui:action-button` snippet은 제거하고, Lynx에서는 `@seed-design/lynx-react`의 `ActionButton`을 직접 사용하도록 문서와 예제를 정리합니다.

- 5647ea3: Lynx compound 컴포넌트에서 웹과 동일한 namespace export를 제공합니다.

  - 기존 `SwitchRoot`, `CheckboxRoot`, `RadioGroupRoot`, `TagGroupRoot` 등 flat export는 유지하면서 `Switch.Root`, `Checkbox.Root`, `RadioGroup.Root`, `TagGroup.Root` 형태를 함께 지원합니다.
  - `ProgressCircleRoot`, `ProgressCircleRange`, `ProgressCircleRootProps` flat export를 추가합니다. 기존 `ProgressCircle.Root` / `ProgressCircle.Range` 사용은 namespace export로 유지됩니다.

- 02862ec: Lynx 의 `Switch` / `Switchmark` / `ActionButton` recipe 를 pseudo selector 대신 `pressed`, `disabled`, `loading`, `checked` boolean variant 로 상태를 노출하도록 통일했습니다. recipe 를 직접 호출할 때 임시 타입 cast 없이 type-safe 하게 boolean 을 전달할 수 있습니다.

  - `actionButton({ pressed, disabled, loading })`, `switchStyle({ disabled })`, `switchmark({ checked, disabled })` 가 native boolean variant 노출
  - ActionButton 의 pressed 상태가 `usePressTap` 결과를 React state 로 받아 className modifier 에 적용 (이전에는 native `:active` cascade 의존)

- be6843e: (사용자 변경사항 없음) `@seed-design/lynx-react` 패키지의 내부 폴더 구조를 정리합니다.

## 0.2.0-alpha.1

### Minor Changes

- d0ea7fe: `BottomSheet` 컴포넌트 추가 (`@lynx-js/lynx-ui-sheet` 래핑)

  - 공개 컴포넌트: `BottomSheetRoot`, `BottomSheetTrigger`, `BottomSheetBackdrop`, `BottomSheetContent`, `BottomSheetHandle`, `BottomSheetHeader`, `BottomSheetTitle`, `BottomSheetDescription`, `BottomSheetBody`, `BottomSheetFooter`
  - 공개 API는 웹과 동일하게 `open`/`defaultOpen`/`onOpenChange`를 노출하고 내부에서 lynx-ui-sheet의 `show`/`defaultShow`/`onShowChange`로 매핑
  - `createSlotRecipeContext` 유틸을 Lynx 버전으로 포팅해 `packages/lynx-react/src/utils/create-slot-recipe-context.tsx` 신규 — 이후 복합 슬롯 컴포넌트의 공통 기반
  - `BottomSheetCloseButton`은 Tier B로 분리 (SVG 지원 후 추가 예정)
  - `lazyMount`/`unmountOnExit`는 미지원 — `forceMount`로 대체
  - `@lynx-js/lynx-ui-sheet` peerDependency 추가

- 2194ead: `@seed-design/lynx-react` 내부 구조 정리 + 런타임 버그 수정

  **Public API 변경 (Breaking)**

  - `createRecipeContext` export 제거 — 내부 실사용 0건. 단일 slot 컴포넌트 포팅 시 필요하면 재도입.
  - `createCompoundContext` export 제거 — Switch 단독 사용이라 inline `React.createContext + null-check throw` 패턴으로 교체. lynx-ui 의 13 개 compound 패키지가 동일 inline 패턴.
  - `dynamicStyle` export + `./dynamic-style` subpath export 제거 — 모노레포 전체에서 실사용 0건. Skeleton / Scrollable 로드맵 컴포넌트 도입 시점에 CSS 변수 주입 방식 재검토.

  **런타임 버그 수정**

  - `ActionButton` 이 `withProvider("view", "root")` / `withContext("text", "text")` 로 intrinsic string 을 인자로 넘기고 있어 `BackgroundSnapshot not found: view` 런타임 에러를 유발하던 **기존 버그** 수정. `ActionButtonRoot` / `ActionButtonTextSlot` 을 파일-내 `forwardRef` + 리터럴 `<view>` / `<text>` JSX 로 재작성. PR #1489 가 BottomSheet 에만 적용한 fix 를 ActionButton 에도 동일하게 적용.

  **내부 정리**

  - `useControllableState`, `usePressTap` 훅을 `src/utils/` → `src/hooks/` 로 이동 (public export 이름 변경 없음, 상대 경로만 이동).
  - `AGENTS.md` 에 "Native tag literal JSX constraint" 섹션 추가 — 허용/금지 패턴 표, PR #1489 (`withContext("view")` 실패) + **PR #1503 spike** (`createSlotRecipeContext` 공통 유틸 파일 안의 factory 도 실패) 실증 근거, Lynx 엔진 레벨 근본 원인(`ConvertStringTagToEnumTag` enum 변환 실패) 정리. **핵심 발견**: Lynx 컴파일러는 리터럴 `<view>` / `<text>` JSX 를 **파일 단위**로 정적 분석하기 때문에, 리터럴 JSX 가 렌더 대상 컴포넌트 파일과 동일한 파일 안에 있어야 한다 — 공통 유틸 파일의 helper 로 추출 불가.

  **Spike 실패 기록**

  이번 PR 에서 `createSlotRecipeContext` 반환 객체에 `withViewContext(slot)` / `withTextContext(slot)` 헬퍼를 추가해 BottomSheet 의 로컬 `createViewSlot`/`createTextSlot` factory 를 대체하려 시도했으나, 런타임 `BackgroundSnapshot not found: view` 에러로 revert. 구조는 BottomSheet 의 기존 factory 와 동일 (1-layer `forwardRef` + 리터럴 `<view>`) 이지만 선언 파일이 달라 Lynx 컴파일러의 파일-스코프 정적 분석을 통과하지 못함. BottomSheet 의 기존 `createViewSlot` / `createTextSlot` factory 는 그대로 유지.

- d410a4c: Add recipe/slot-recipe context utilities and refactor ActionButton to use them.

  - `createRecipeContext`: single-slot recipe context with `withContext` HOC.
  - `createSlotRecipeContext`: multi-slot recipe context with `withRootProvider` / `withProvider` / `withContext` for wrapping React function components, plus `withViewContext` / `withTextContext` factories that emit literal `<view>` / `<text>` JSX for native intrinsic slots (required to pass the Lynx compiler's BackgroundSnapshot static analysis).
  - Export `NativeSlotProps` type for compound components extending native slot props.
  - Internal `splitMultipleVariantsProps` utility for compound components that host multiple recipes (first consumer: TagGroup in a follow-up PR).
  - `ActionButton` refactored internally to compose via `withProvider("view", "root")` + `withContext("text", "text")`. Public API unchanged.

- ada0152: Lynx 플랫폼용 `Switch` 컴포넌트 추가

  - `SwitchRoot`, `SwitchControl`, `SwitchThumb`, `SwitchLabel` export
  - `useControllableState`와 `usePressTap` primitive 인라인 조합으로 구현 (별도 `useSwitch` 훅 없음)
  - 웹 대비 제외: `SwitchHiddenInput`, `name`/`value`/`required`/`invalid`, focus/focusVisible (Lynx 런타임 미지원)
  - `active` (pressed) 모디파이어는 `switchmark` recipe CSS에 pressed 상태 추가 시 활성화 예정

- 70054ea: TagGroup 컴포넌트 추가 + qvism preset 웹/Lynx 분리

  - `@seed-design/lynx-react`: `TagGroupRoot`, `TagGroupItem`, `TagGroupItemLabel` 지원. Root에서 `size`/`weight`/`tone`을 Context로 Item에 전파, children 사이에 separator 자동 삽입 (기본 `" · "`, `separator` prop으로 커스텀 가능). 웹 대비 `<span>` → `<view>`/`<text>` 렌더, `flexShrink`·`asChild`·아이콘 slot 미지원.
  - `@seed-design/lynx-css`: qvism preset이 `@seed-design/qvism-preset` (웹) 과 `@seed-design/qvism-preset/lynx` (Lynx) 로 완전 분리됨. Lynx preset은 `@lynx-js/types`의 `CSSProperties` 타입으로 recipe 작성 시 미지원 property를 컴파일 타임에 차단. TagGroup recipe를 Lynx flex row 기반으로 재작성.

### Patch Changes

- 368b7d9: `BottomSheet`에 필요한 `@lynx-js/lynx-ui-sheet`를 `@seed-design/lynx-react`의 직접 의존성으로 포함합니다.

  - `BottomSheet` 사용 시 `@lynx-js/lynx-ui-sheet`를 별도로 설치하지 않아도 됩니다.
  - Lynx `BottomSheet` 문서와 레지스트리 설치 안내를 패키지 의존성 구조에 맞게 정리합니다.

## 0.1.1-alpha.0

### Patch Changes

- aaec799: feat(lynx): initial alpha release

  - `@seed-design/lynx-primitive`: Slot, composeRefs
  - `@seed-design/lynx-css`: 디자인 토큰, CSS 레시피
  - `@seed-design/lynx-react`: ActionButton, ProgressCircle

- Updated dependencies [aaec799]
  - @seed-design/lynx-primitive@0.1.1-alpha.0
  - @seed-design/lynx-css@0.1.1-alpha.0

# Phase 5: 오버레이/시트 컴포넌트

오버레이, 애니메이션이 필요한 복잡 컴포넌트들. **`@lynx-js/lynx-ui-*`을 래핑**하는 것이 기본 전략 (제스처·스프링 물리·프레즌스 상태 머신은 lynx-ui에 위임).

> **Portal은 Lynx에서 제외** — 웹의 `createPortal` 개념은 Lynx에서 불필요. 오버레이는 `@lynx-js/lynx-ui-overlay`의 `OverlayView`가 처리.

**Phase 의존성:** `@lynx-js/lynx-ui-dialog`, `@lynx-js/lynx-ui-sheet` (전이적으로 `-overlay`, `-presence`, `-common`)

---

## 1. Dialog (lynx-ui-dialog 래핑)

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
- 공개 API 이름을 `@seed-design/react`와 일치시키기 (`lazyMount`, `unmountOnExit`, `onOpenChange` 등)
- `DialogAction` 같은 SEED 고유 compound 추가

**미지원 / Tier B:**
- `DialogCloseButton` 은 CloseButton SVG 필요 → Tier B
- FocusScope, Escape key, DismissableLayer(키보드) 는 Lynx 모바일에서 불필요

- [ ] `src/components/Dialog/Dialog.tsx`
- [ ] `docs/content/lynx/components/dialog.mdx`
- [ ] `examples/lynx-spa/src/pages/DialogPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-dialog`

---

## 2. BottomSheet (lynx-ui-sheet 래핑) — 우선 착수

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

**미지원 / Tier B:**
- `BottomSheetCloseButton` (별도 컴포넌트로 분리 — SVG 아이콘 필요)

- [ ] `src/components/BottomSheet/BottomSheet.tsx`
- [ ] `docs/content/lynx/components/bottom-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/BottomSheetPage.tsx`
- [ ] `packages/lynx-react/package.json` peerDependencies: `@lynx-js/lynx-ui-sheet`

---

## 3. ActionSheet (deprecated → MenuSheet)

**React 소스**: `packages/react/src/components/ActionSheet/ActionSheet.tsx`
**Lynx CSS recipe**: `actionSheet`

**주의:** deprecated. MenuSheet를 우선 구현.

- [ ] `src/components/ActionSheet/ActionSheet.tsx`
- [ ] `docs/content/lynx/components/action-sheet.mdx`

---

## 4. ExtendedActionSheet (deprecated → MenuSheet)

**React 소스**: `packages/react/src/components/ExtendedActionSheet/ExtendedActionSheet.tsx`
**Lynx CSS recipe**: `extendedActionSheet`

**주의:** deprecated. MenuSheet를 우선 구현.

- [ ] `src/components/ExtendedActionSheet/ExtendedActionSheet.tsx`
- [ ] `docs/content/lynx/components/extended-action-sheet.mdx`

---

## 5. MenuSheet (lynx-ui-sheet 또는 lynx-ui-dialog 래핑)

**React 소스**: `packages/react/src/components/MenuSheet/MenuSheet.tsx`
**래핑 대상**: 디자인 확인 후 결정. 모바일에서 바텀 시트 스타일로 뜬다면 `@lynx-js/lynx-ui-sheet`, 정적 오버레이면 `@lynx-js/lynx-ui-dialog`.
**Lynx CSS recipes**: `menuSheet`, `menuSheetItem`

**Exports:** `MenuSheetRoot`, `MenuSheetTrigger`, `MenuSheetBackdrop`, `MenuSheetContent`, `MenuSheetHeader`, `MenuSheetTitle`, `MenuSheetDescription`, `MenuSheetList`, `MenuSheetGroup`, `MenuSheetItem`, `MenuSheetItemContent`, `MenuSheetItemLabel`, `MenuSheetItemDescription`, `MenuSheetFooter`

**Lynx 구현 포인트:**
- Dialog 또는 BottomSheet 래핑을 베이스로 MenuSheet 슬롯 추가
- `MenuSheetItem`: `bindtap`으로 아이템 선택 (SEED 컴포넌트 레벨에서 처리)
- 많은 sub-component → Context로 variant 전파

**미지원 / Tier B:**
- `MenuSheetCloseButton` — CloseButton SVG 필요

- [ ] `src/components/MenuSheet/MenuSheet.tsx`
- [ ] `docs/content/lynx/components/menu-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/MenuSheetPage.tsx`

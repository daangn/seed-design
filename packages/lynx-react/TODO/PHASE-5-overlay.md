# Phase 5: 오버레이/시트 컴포넌트

포탈, 오버레이, 애니메이션이 필요한 복잡 컴포넌트들.
lynx-ui-dialog, lynx-ui-sheet, lynx-ui-presence를 핵심 참고.

---

## 1. Portal

**React 소스**: `packages/react/src/components/Portal/Portal.tsx`
**React headless**: `packages/react-headless/portal/src/`
**Lynx CSS recipe**: 없음

**Props:**
- `disabled?: boolean` — true면 children 인라인 렌더
- `container?: RefObject<HTMLElement | null>` — 렌더 대상

**Lynx 구현 포인트:**
- 웹: `ReactDOM.createPortal`로 document.body에 렌더
- Lynx: `createPortal` 지원 여부 확인 필요
- 미지원이면 Lynx 네이티브 오버레이 API 사용 (lynx-ui-overlay 참고)

**참고:**
- lynx-ui-overlay: `/Documents/GitHub/lynx-ui/packages/lynx-ui-overlay/src/`

- [ ] `src/components/Portal/Portal.tsx`
- [ ] `docs/content/lynx/components/portal.mdx`

---

## 2. Dialog

**React 소스**: `packages/react/src/components/Dialog/Dialog.tsx`
**React headless**: `packages/react-headless/dialog/src/`
**lynx-ui 참고**: `/Documents/GitHub/lynx-ui/packages/lynx-ui-dialog/src/`
**Lynx CSS recipe**: `dialog` (7슬롯: positioner, backdrop, content, header, title, description, footer)

**Exports:** `DialogRoot`, `DialogTrigger`, `DialogPositioner`, `DialogBackdrop`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogAction`

**웹 headless 동작:**
- useDialog → open/close 상태, FocusScope, DismissableLayer
- Presence → lazyMount/unmountOnExit 애니메이션 연동

**lynx-ui-dialog 핵심 패턴:**
```
파일 구조:
├── Dialog.tsx          — DialogRoot, DialogView, DialogContent
├── DialogButton.tsx    — DialogTrigger, DialogClose
├── DialogContext.tsx    — show, groupState, onOpen/onClose
```
- `usePresenceGroup`: 애니메이션 상태 머신 (Entering/Leaving/Left/Entered)
- `presenceClassVariants()`: 애니메이션 CSS 클래스 생성
- `OverlayView`: 오버레이 포지셔닝
- Backdrop: `bindtap`으로 clickToClose
- Busy state: 애니메이션 중 인터랙션 차단

**Lynx 구현 포인트:**
- **useDialog 훅 구현**: open/close 상태 + `useControllableState`
- **Presence 패턴**: lynx-ui-presence 참고 또는 dependency
- **Backdrop tap**: bindtap으로 닫기
- **FocusScope 불필요** (Lynx 모바일)
- **DismissableLayer**: 뒤로가기 제스처로 닫기 (Lynx API 확인)
- **Escape key 불필요** (모바일)

**참고 파일:**
- `/Documents/GitHub/lynx-ui/packages/lynx-ui-presence/src/` — 애니메이션 상태 관리

- [ ] `src/components/Dialog/useDialog.ts`
- [ ] `src/components/Dialog/Dialog.tsx`
- [ ] `docs/content/lynx/components/dialog.mdx`
- [ ] `examples/lynx-spa/src/pages/DialogPage.tsx`

---

## 3. BottomSheet

**React 소스**: `packages/react/src/components/BottomSheet/BottomSheet.tsx`
**lynx-ui 참고**: `/Documents/GitHub/lynx-ui/packages/lynx-ui-sheet/src/`
**Lynx CSS recipe**: `bottomSheet`

**Exports:** `BottomSheetRoot`, `BottomSheetTrigger`, `BottomSheetPositioner`, `BottomSheetBackdrop`, `BottomSheetContent`, `BottomSheetHeader`, `BottomSheetTitle`, `BottomSheetDescription`, `BottomSheetBody`, `BottomSheetFooter`, `BottomSheetCloseButton`

**웹 동작:**
- Drawer.Root (direction="bottom") 기반
- 드래그로 닫기, 스냅 포인트

**lynx-ui-sheet 핵심 패턴:**
```
파일 구조:
├── SheetRoot/          — 상태 관리
├── SheetContent/       — 콘텐츠 영역
├── SheetBackdrop/      — 배경 오버레이
├── SheetHandle/        — 드래그 핸들
├── SheetView/          — 메인 뷰
├── context/            — Context API
├── hooks/              — 커스텀 훅
└── utils/              — 유틸
```
- 터치 기반 드래그 제스처
- 스냅 포인트 시스템
- 애니메이션 (lynx-ui-presence 통합)

**Lynx 구현 포인트:**
- Dialog와 동일한 open/close + Presence 패턴
- **드래그 제스처**: `bindtouchstart/move/end`로 구현
- **스냅 포인트**: 높이 기반 스냅
- 가장 복잡한 컴포넌트 중 하나

- [ ] `src/components/BottomSheet/useBottomSheet.ts`
- [ ] `src/components/BottomSheet/BottomSheet.tsx`
- [ ] `docs/content/lynx/components/bottom-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/BottomSheetPage.tsx`

---

## 4. BottomSheetHandle

**React 소스**: `packages/react/src/components/BottomSheetHandle/BottomSheetHandle.tsx`
**Lynx CSS recipe**: `bottomSheetHandle` (2슬롯: root, touchArea)

**구현:**
- BottomSheet과 함께 사용
- Drawer.Handle 래퍼
- touchArea: aria-hidden 터치 영역

- [ ] `src/components/BottomSheetHandle/BottomSheetHandle.tsx`
- [ ] `docs/content/lynx/components/bottom-sheet-handle.mdx`

---

## 5. ActionSheet (deprecated → MenuSheet)

**React 소스**: `packages/react/src/components/ActionSheet/ActionSheet.tsx`
**Lynx CSS recipe**: `actionSheet`

**주의:** deprecated. MenuSheet를 우선 구현.

- [ ] `src/components/ActionSheet/ActionSheet.tsx`
- [ ] `docs/content/lynx/components/action-sheet.mdx`

---

## 6. ExtendedActionSheet (deprecated → MenuSheet)

**React 소스**: `packages/react/src/components/ExtendedActionSheet/ExtendedActionSheet.tsx`
**Lynx CSS recipe**: `extendedActionSheet`

**주의:** deprecated. MenuSheet를 우선 구현.

- [ ] `src/components/ExtendedActionSheet/ExtendedActionSheet.tsx`
- [ ] `docs/content/lynx/components/extended-action-sheet.mdx`

---

## 7. MenuSheet

**React 소스**: `packages/react/src/components/MenuSheet/MenuSheet.tsx`
**Lynx CSS recipes**: `menuSheet`, `menuSheetItem`

**Exports:** `MenuSheetRoot`, `MenuSheetTrigger`, `MenuSheetPositioner`, `MenuSheetBackdrop`, `MenuSheetContent`, `MenuSheetHeader`, `MenuSheetTitle`, `MenuSheetDescription`, `MenuSheetList`, `MenuSheetGroup`, `MenuSheetItem`, `MenuSheetItemContent`, `MenuSheetItemLabel`, `MenuSheetItemDescription`, `MenuSheetFooter`, `MenuSheetCloseButton`

**Variant Props:**
- Root: `lazyMount`, `unmountOnExit`
- Content: `labelAlign`
- Item: variant props

**Lynx 구현 포인트:**
- Dialog 기반이므로 Dialog 구현 후 확장
- 많은 sub-component → Context로 variant 전파
- MenuSheetItem: bindtap으로 아이템 선택

- [ ] `src/components/MenuSheet/MenuSheet.tsx`
- [ ] `docs/content/lynx/components/menu-sheet.mdx`
- [ ] `examples/lynx-spa/src/pages/MenuSheetPage.tsx`

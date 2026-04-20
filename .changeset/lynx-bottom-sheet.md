---
"@seed-design/lynx-react": minor
---

`BottomSheet` 컴포넌트 추가 (`@lynx-js/lynx-ui-sheet` 래핑)

- 공개 컴포넌트: `BottomSheetRoot`, `BottomSheetTrigger`, `BottomSheetBackdrop`, `BottomSheetContent`, `BottomSheetHandle`, `BottomSheetHeader`, `BottomSheetTitle`, `BottomSheetDescription`, `BottomSheetBody`, `BottomSheetFooter`
- 공개 API는 웹과 동일하게 `open`/`defaultOpen`/`onOpenChange`를 노출하고 내부에서 lynx-ui-sheet의 `show`/`defaultShow`/`onShowChange`로 매핑
- `createSlotRecipeContext` 유틸을 Lynx 버전으로 포팅해 `packages/lynx-react/src/utils/create-slot-recipe-context.tsx` 신규 — 이후 복합 슬롯 컴포넌트의 공통 기반
- `BottomSheetCloseButton`은 Tier B로 분리 (SVG 지원 후 추가 예정)
- `lazyMount`/`unmountOnExit`는 미지원 — `forceMount`로 대체
- `@lynx-js/lynx-ui-sheet` peerDependency 추가

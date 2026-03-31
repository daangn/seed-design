---
"@seed-design/react-drawer": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

(BREAKING CHANGE: MenuSheet snippet을 다시 설치해야 합니다.) MenuSheet에서 CloseButton을 제거하고 Handle을 추가합니다.

- `MenuSheet.CloseButton`, `MenuSheetCloseButton` export 제거
- `MenuSheet.Handle` 컴포넌트 추가 (bottom-sheet-handle recipe 재사용)
- `MenuSheetTitle`에서 `useDrawerContext` 의존 제거

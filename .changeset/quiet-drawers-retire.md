---
"@seed-design/react": major
"@seed-design/react-drawer": major
---

(BREAKING CHANGE: 아래 prop을 사용하는 코드에서 해당 prop을 삭제해야 합니다.) `@seed-design/react`의 다음 prop을 제거합니다.

- `BottomSheet.Root`의 `nested`
- `ResponsiveDialog.Root`의 `bottomSheetRootProps.nested`
- `ResponsiveSidePanel.Root`의 `bottomSheetRootProps.nested`

모두 동작에 영향을 주지 않던 dead prop이므로 대체 prop은 필요하지 않습니다. `@seed-design/react-drawer`를 직접 사용하는 경우에도 `nested` prop을 삭제해야 합니다.

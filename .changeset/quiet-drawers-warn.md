---
"@seed-design/react": minor
"@seed-design/react-drawer": minor
---

`@seed-design/react`의 다음 prop을 deprecated로 표시하고, 3.0.0에서 제거할 예정입니다.

- `BottomSheet.Root`의 `nested`
- `ResponsiveDialog.Root`의 `bottomSheetRootProps.nested`
- `ResponsiveSidePanel.Root`의 `bottomSheetRootProps.nested`

모두 동작에 영향을 주지 않는 dead prop이므로 대체 prop 없이 삭제할 수 있습니다. `@seed-design/react-drawer`를 직접 사용하는 경우의 `nested` prop도 deprecated로 표시하고, 해당 패키지의 3.0.0에서 제거할 예정입니다.

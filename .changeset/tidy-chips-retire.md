---
"@seed-design/react": major
---

(BREAKING CHANGE: 제거된 컴포넌트와 snippet을 대체 컴포넌트로 교체해야 합니다.) deprecated 컴포넌트를 제거합니다. 대체 컴포넌트는 [Deprecations](https://seed-design.io/docs/migration/deprecations) 문서의 제거 완료 히스토리를 참고하세요.

- `ActionChip`, `ControlChip`, `ActionSheet`, `ExtendedActionSheet`, `Fab`, `ExtendedFab`, `InlineBanner`, `LinkContent`, `Inline`, `Columns`, `Column`, `Stack`과 각 컴포넌트의 하위 컴포넌트·Props 타입을 제거합니다.
- 제거된 컴포넌트를 사용하던 `ui:action-sheet`, `ui:extended-action-sheet`, `ui:control-chip`, `ui:inline-banner` snippet도 제거되었습니다. 각각 `ui:swipeable-menu-sheet`, `ui:swipeable-menu-sheet`, `ui:chip`, `ui:page-banner`로 교체하세요.

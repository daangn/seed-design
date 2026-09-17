---
"@seed-design/react": major
"@seed-design/css": major
"@seed-design/lynx-css": major
"@seed-design/rootage-artifacts": major
---

deprecated 컴포넌트와 이들만 사용하던 recipe, Rootage 컴포넌트 스펙을 제거합니다. 대체 컴포넌트는 [Deprecations](https://seed-design.io/docs/migration/deprecations) 문서의 제거 완료 히스토리를 참고하세요.

- `@seed-design/react`에서 `ActionChip`, `ControlChip`, `ActionSheet`, `ExtendedActionSheet`, `Fab`, `ExtendedFab`, `InlineBanner`, `LinkContent`, `Inline`, `Columns`, `Column`, `Stack`을 제거합니다.
- `@seed-design/css`에서 `action-chip`, `action-sheet`, `action-sheet-item`, `control-chip`, `extended-action-sheet`, `extended-action-sheet-item`, `extended-fab`, `fab`, `inline-banner`, `link-content` recipe를 제거합니다.
- Rootage에서 `control-chip`, `inline-banner` 컴포넌트 스펙을 제거하고, `@seed-design/css`와 `@seed-design/lynx-css`에서 두 스펙의 컴포넌트 변수를 제거합니다.

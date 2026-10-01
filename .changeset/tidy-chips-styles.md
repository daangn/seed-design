---
"@seed-design/css": major
---

(BREAKING CHANGE: 제거된 스타일 모듈과 클래스를 직접 참조했다면 대체 컴포넌트의 스타일로 교체해야 합니다.) deprecated 컴포넌트만 사용하던 스타일을 제거합니다. 대체 컴포넌트는 [Deprecations](https://seed-design.io/docs/migration/deprecations) 문서의 제거 완료 히스토리를 참고하세요.

- `@seed-design/css/recipes/*`에서 `action-chip`, `action-sheet`, `action-sheet-item`, `control-chip`, `extended-action-sheet`, `extended-action-sheet-item`, `extended-fab`, `fab`, `inline-banner`, `link-content` 모듈과 CSS 파일을 제거합니다.
- `.seed-action-chip`, `.seed-control-chip`, `.seed-action-sheet__*`, `.seed-action-sheet-item`, `.seed-extended-action-sheet__*`, `.seed-extended-action-sheet-item`, `.seed-fab`, `.seed-extended-fab`, `.seed-inline-banner__*`, `.seed-link-content` 클래스를 제거합니다.

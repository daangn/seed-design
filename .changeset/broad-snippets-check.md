---
"@seed-design/cli": minor
---

`add`, `add-all`, `compat`이 스니펫에 선언된 모든 패키지의 버전 호환성을 검사합니다.

- 지금까지는 `@seed-design/react`, `@seed-design/css`(Lynx는 `@seed-design/lynx-react`, `@seed-design/lynx-css`)만 검사했습니다.
- 새로 검사하는 패키지는 `@stackflow/react`(`ui:app-screen`), `@seed-design/react-pagination`(`ui:pagination`, `ui:table-pagination`), `@dnd-kit/react`·`@dnd-kit/dom`·`@dnd-kit/abstract`(`ui:attachment-field-reorderable`, `ui:attachment-display-field-reorderable`), `@karrotmarket/lynx-monochrome-icon`(Lynx `ui:accordion`, `ui:field-button`, `ui:list`, `ui:select-box`)입니다.
- 설치된 버전이 스니펫의 요구 범위를 벗어나면 `compat`이 종료 코드 `1`로 끝날 수 있습니다.

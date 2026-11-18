---
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
---

Pagination Button·Pagination Page Item을 `@seed-design/react` 컴포넌트(`PaginationButton`·`PaginationPageItem`)로 제공하고, 눌림 축소를 요소의 렌더된 크기로 계산하는 Scale Feedback으로 바꿉니다.

- `ui:pagination`·`ui:table-pagination` snippet은 새 컴포넌트를 사용합니다. 기존 `lib:pagination-button`·`lib:pagination-page-item` snippet은 제거됩니다.
- 이전 snippet을 그대로 쓰면 눌러도 축소되지 않습니다. `ui:pagination`·`ui:table-pagination`을 다시 설치하세요.
- 다시 설치한 뒤에는 프로젝트에 남아 있는 `pagination-button.tsx`·`pagination-page-item.tsx` lib snippet을 쓰지 않으므로 삭제해도 됩니다. 다른 코드에서 import하고 있다면 `@seed-design/react`의 `PaginationButton`·`PaginationPageItem`으로 바꾸세요.

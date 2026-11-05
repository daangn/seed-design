# @seed-design/react-pagination

## 1.0.0

### Major Changes

- f73ee94: Pagination과 Table Pagination을 추가합니다.

  - `usePagination`은 controlled·uncontrolled 상태, 페이지 범위 계산과 이전·다음 이동을 제공합니다.
  - `useTablePagination`은 전체 개수를 아는 경우와 모르는 경우를 모두 지원합니다.
  - Pagination은 전체 페이지가 0개 또는 1개이면 표시하지 않습니다.
  - `ui:pagination`, `ui:table-pagination` snippet으로 설치할 수 있습니다.
  - 표시 문구와 접근성 이름을 앱 언어에 맞게 수정할 수 있습니다.

  ```sh
  npx @seed-design/cli@latest add ui:pagination
  npx @seed-design/cli@latest add ui:table-pagination
  ```

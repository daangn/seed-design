---
"@seed-design/react": patch
"@seed-design/css": patch
---

Field(TextField)의 스타일을 수정합니다.

- `maxGraphemeCount`를 사용하지만 `description`을 사용하지 않는 경우 `maxGraphemeCount`가 우측이 아닌 좌측에 표시되는 문제를 수정합니다.
- Tailwind Preflight 사용 시 Character Count 영역이 디자인 의도보다 높이를 더 많이 차지하는 문제를 수정합니다.

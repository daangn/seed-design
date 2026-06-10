---
"@seed-design/css": patch
"@seed-design/react-popover": patch
---

HelpBubble이 좁은 화면(브라우저 확대 등)에서 화면 밖으로 잘리던 문제를 수정합니다.

- Popover의 floating 요소 너비를 viewport에 맞게 동적으로 제한합니다 (floating-ui `size` 미들웨어 추가).
- 긴 텍스트가 좁은 화면에서 말풍선 밖으로 넘치지 않도록 `overflow-wrap: break-word`를 적용합니다 (`word-break: keep-all`은 유지하여 가능한 한 어절 단위로 줄바꿈).

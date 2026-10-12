---
"@seed-design/lynx-react": patch
---

처음부터 열린 `Accordion.Content`가 높이 `0px`에서 펼쳐지던 문제를 수정합니다.

- 열린 `Accordion.Content`·`CheckSelectBox.Footer`·`RadioSelectBox.Footer`는 초기 높이를 내용에 맞춰, 처음 표시할 때 펼침 애니메이션 없이 내용을 보여줍니다.

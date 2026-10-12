---
"@seed-design/lynx-react": patch
---

`Divider`의 `orientation`이나 `inset`을 바꿀 때 이전 방향의 크기와 여백이 남아 레이아웃이 어긋나던 문제를 수정합니다.

- 방향이나 inset이 바뀌면 새 크기와 여백으로 요소를 다시 만들며, 전달한 ref도 새 요소에 다시 연결합니다.

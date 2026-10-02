---
"@seed-design/lynx-react": patch
---

`Divider`의 `orientation`이나 `inset`을 바꾸면 이전 방향의 `width`·`height`·`margin`이 남아 크기와 간격이 어긋나던 문제를 수정합니다. 두 값이 바뀌면 native view를 다시 만들고 forwarded ref도 새 view에 다시 연결합니다.

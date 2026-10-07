---
"@seed-design/css": patch
"@seed-design/stackflow": patch
---

`AppScreen`이 좌우 safe area inset을 반영합니다.

- `AppBar`와 `AppScreenContent`의 내용이 좌우 inset만큼 안쪽으로 들어가서, 가로 모드처럼 좌우 inset이 있는 화면에서도 디스플레이 컷아웃에 가려지지 않습니다.
- 화면 끝까지 채워야 하는 이미지나 가로 스크롤 영역은 `--seed-safe-area-left`, `--seed-safe-area-right`만큼 음수 margin을 지정합니다.
- `@seed-design/css`와 `@seed-design/stackflow`는 어느 한쪽만 올려도 동작합니다. 좌우 inset 반영은 `@seed-design/css`를 올리면 적용됩니다.

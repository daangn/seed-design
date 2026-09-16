---
"@seed-design/css": minor
"@seed-design/stackflow": patch
---

`AppScreen`이 좌우 safe area inset을 반영합니다.

- `AppBar`와 `AppScreenContent`의 내용이 좌우 inset만큼 안쪽으로 들어가서, 가로 모드처럼 좌우 inset이 있는 화면에서도 디스플레이 컷아웃에 가려지지 않습니다.
- 화면 끝까지 채워야 하는 이미지나 가로 스크롤 영역은 `Box`의 `bleedX`에 `"safeArea"`를 지정합니다.

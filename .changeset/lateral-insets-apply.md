---
"@seed-design/css": minor
"@seed-design/stackflow": patch
---

`AppScreen`이 좌우 safe area inset을 반영합니다.

- `AppBar`와 `AppScreenContent`의 내용이 좌우 inset만큼 안쪽으로 들어가서, 가로 모드처럼 좌우 inset이 있는 화면에서도 디스플레이 컷아웃에 가려지지 않습니다.
- 좌우 inset 값을 담은 `--seed-safe-area-left`, `--seed-safe-area-right` CSS 변수를 추가합니다.
- 화면을 회전해 inset이 바뀌면 가운데 정렬된 `AppBar` 제목의 여백도 다시 계산합니다.
- 화면 끝까지 채워야 하는 이미지나 가로 스크롤 영역은 `Box`의 `bleedX`에 `"safeArea"`를 지정합니다.

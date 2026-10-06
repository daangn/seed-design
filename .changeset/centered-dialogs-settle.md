---
"@seed-design/css": patch
---

Dialog가 safe area 안쪽 영역을 기준으로 가운데에 놓이도록 수정합니다. 기본 너비·최대 너비와 최대 높이에서 safe area inset을 빼서, 노치·홈 인디케이터·가로 화면의 측면 inset이 있는 기기에서도 Dialog가 inset 영역에 걸치지 않습니다. Backdrop은 계속 화면 전체를 덮습니다.

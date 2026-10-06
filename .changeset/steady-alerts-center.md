---
"@seed-design/css": patch
---

노치·홈 인디케이터·가로 화면의 측면 inset이 있는 기기에서 AlertDialog가 safe area inset 영역에 걸치지 않도록 수정합니다. 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 좌우 여백(32px)이 inset 안쪽에서부터 적용됩니다. 세로로는 위아래 inset 중 큰 값만큼 양쪽을 비워 화면 정중앙에 놓이고, 내용이 그 사이 높이보다 길면 AlertDialog 높이가 거기서 멈추고 내용은 AlertDialog 안에서 스크롤됩니다. Backdrop은 계속 화면 전체를 덮습니다.

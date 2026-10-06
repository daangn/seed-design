---
"@seed-design/css": patch
---

AlertDialog가 safe area 안쪽 영역을 기준으로 가운데에 놓이도록 수정합니다. 좌우 여백(32px)이 safe area inset 안쪽에서부터 적용되고, 노치·홈 인디케이터·가로 화면의 측면 inset이 있는 기기에서도 AlertDialog가 inset 영역에 걸치지 않습니다. 내용이 safe area 높이보다 길면 AlertDialog 높이가 safe area 안으로 제한되고 내용은 AlertDialog 안에서 스크롤됩니다. Backdrop은 계속 화면 전체를 덮습니다.

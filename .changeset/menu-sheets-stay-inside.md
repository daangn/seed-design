---
"@seed-design/css": patch
---

MenuSheet·SwipeableMenuSheet의 내용이 safe area 안쪽에 놓이도록 수정합니다. 좌우 inset에 닿는 만큼 헤더·항목·닫기 버튼이 안쪽으로 들어오고, 최대 너비 때문에 가운데에 떠서 inset에 닿지 않으면 여백이 늘지 않습니다. 항목이 많으면 시트 높이가 화면 위쪽 safe area 아래로 제한되고 `MenuSheetList`(`SwipeableMenuSheetList`)가 스크롤됩니다. 배경과 Backdrop은 계속 화면 끝까지 채웁니다.

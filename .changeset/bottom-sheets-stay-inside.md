---
"@seed-design/css": patch
---

BottomSheet가 safe area inset 영역에 걸치지 않도록 수정합니다. 가로로는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비는 최대 너비와 그 영역의 너비 중 작은 쪽입니다. 내용이 길면 BottomSheet 높이가 화면 위쪽 safe area 아래로 제한되고 `BottomSheetBody`가 스크롤됩니다. 아래쪽 배경과 Backdrop은 계속 화면 끝까지 채웁니다.

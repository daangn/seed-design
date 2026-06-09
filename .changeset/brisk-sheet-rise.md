---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
---

Lynx BottomSheet가 앱 셸 위에 안정적으로 표시되고, 본문 스크롤 제스처를 내부에서 처리하도록 개선합니다.

- BottomSheet overlay의 기본 `z-index`를 높여 앱바 같은 상단 영역까지 backdrop이 덮이도록 수정합니다.
- `BottomSheetBody`가 세로 스크롤 영역으로 렌더링되어 본문을 스크롤할 때 뒤쪽 화면이 함께 스크롤되는 문제를 방지합니다.
- 스크롤 가능한 BottomSheet에서는 `BottomSheetRoot`의 `handleOnly`를 함께 사용할 수 있습니다.
- BottomSheet handle의 드래그 target size를 보이는 handle보다 크게 보장합니다.

---
"@seed-design/react-tabs": major
---

선택한 탭을 화면 안으로 스크롤할 때 탭 옆에 두는 여유 공간을 고정값 16px 대신 탭의 CSS `scroll-margin`으로 정합니다. 탭에 `scroll-margin`을 지정하지 않으면 여유 공간 없이 목록 끝에 맞춰 멈춥니다.

Tabs 인디케이터 위치를 담는 `--indicator-left`가 목록의 padding을 뺀 값, 즉 목록 content box 기준 위치로 바뀝니다. `@seed-design/css`의 Tabs 스타일은 여기에 목록 padding을 더해 인디케이터를 놓으므로, safe area inset처럼 목록 padding만 바뀌어도 인디케이터가 선택한 탭을 따라갑니다.

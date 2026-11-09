---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
"@seed-design/lynx-react-tabs": patch
---

Lynx `Tabs`를 `display: none`으로 숨겼다가 다시 표시하면 indicator가 폭 0인 채로 왼쪽 끝에서 선택된 탭 위치까지 애니메이션되던 문제를 수정합니다. trigger 폭이 측정되지 않은 동안에는 indicator를 숨기고, 측정값이 다시 들어오는 순간에는 애니메이션 없이 제자리에 나타납니다. `useTabsIndicator`는 이 상태를 `isMeasured`로 반환합니다.

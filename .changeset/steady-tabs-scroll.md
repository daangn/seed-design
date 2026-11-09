---
"@seed-design/lynx-react-tabs": patch
"@seed-design/lynx-react": patch
---

Lynx `Tabs`를 `display: none`으로 숨겼다가 다시 표시하면 탭 목록이 첫 번째 탭부터 선택된 탭까지 스크롤 애니메이션되던 문제를 수정합니다. trigger 폭이 측정된 직후의 정렬은 첫 렌더와 숨김 복구 모두 애니메이션 없이 선택된 탭 위치로 바로 이동하고, 선택된 탭 앞의 trigger 폭이 측정되지 않은 동안에는 자동 스크롤하지 않습니다.

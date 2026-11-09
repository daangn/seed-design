---
"@seed-design/lynx-react-collapsible": patch
"@seed-design/lynx-react-accordion": patch
"@seed-design/lynx-react": patch
---

조상 요소를 `display: none`으로 숨겼다가 다시 표시하면 Lynx `useCollapsible`로 열어 둔 내용이 높이 0에서 다시 펼쳐지던 문제를 수정합니다. `Accordion`, `CheckSelectBox`, `RadioSelectBox`에 적용됩니다.

---
"@seed-design/lynx-react-collapsible": minor
"@seed-design/lynx-react-accordion": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `CheckSelectBox`의 `accessibility-value` 기본값이 Checkbox와 같은 `"checked"`·`"not checked"`로 바뀌고, indeterminate이면 `"mixed"`입니다. `SelectBoxGroupProps`·`SelectBoxFooterProps` 타입은 더 이상 export하지 않으므로 `CheckSelectBox.GroupProps`·`RadioSelectBox.FooterProps` 등을 사용하세요.) SelectBox의 선택 기능을 Checkbox·RadioGroup Headless에, footer 접힘을 새 Collapsible Headless에 위임합니다.

- `@seed-design/lynx-react-collapsible`에 스타일 없는 `Root`·`Trigger`·`Content`와 `useCollapsible`·`useCollapsibleTrigger`·`useCollapsibleContent`·`useCollapsibleContext`를 추가합니다. 처음부터 열린 내용은 측정 전에도 접지 않습니다.
- Accordion Item은 Collapsible 상태를 제공하며, Trigger·Content는 Collapsible 파트를 사용합니다. 기본으로 열린 Content가 0px에서 펼쳐지지 않습니다.

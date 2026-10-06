---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `List.CheckboxItem`·`List.RadioItem`·`List.SwitchItem`의 접근성 기본값이 각 컨트롤과 같아집니다. `accessibility-value`는 `선택됨`·`선택 안 됨`·`켜짐`·`꺼짐` 대신 Checkbox `checked`·`not checked`·`mixed`, Switch `checked`·`not checked`, Radio `selected`·`not selected`를 쓰고, 활성 상태의 `accessibility-traits` 기본값 `"button"`을 제거합니다. 행에 Checkbox·Switch·Radio의 `tone`·`variant`·`weight`·`size`를 넘기던 코드는 suffix의 `Checkbox.Control` 등에 지정하세요. `listItem` Recipe의 `interactionRoot` slot을 제거합니다.) List 선택 항목이 styled 컨트롤 Root로 감싸지 않고 행 하나를 접근성 요소로 렌더링합니다. 이전에는 바깥 컨트롤과 안쪽 행이 각각 접근성 요소였고 indeterminate가 행에 반영되지 않았습니다. `Checkbox.Control`·`Checkbox.Indicator`, `Switch.Control`, `RadioGroup.ItemControl`·`RadioGroup.ItemIndicator`가 Headless Root 아래에서도 상태를 표시합니다.

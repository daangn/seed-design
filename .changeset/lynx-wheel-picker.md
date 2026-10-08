---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

세로로 드래그하여 항목을 선택하는 Lynx `WheelPicker`를 추가합니다. `WheelPicker.Root`·`Column`·`ItemLabel`로 여러 열을 조합하고, 각 `Column`의 `options`·`value`·`defaultValue`·`onValueChange`로 선택값을 관리합니다.

`loop`로 항목을 반복하고, `onIndexChange`로 조작 중 지나가는 항목을 확인할 수 있습니다. `valueChangeBehavior`·`renderLabel`로 이동 방식과 항목 표시를 지정하며, `@seed-design/lynx-css/recipes/wheel-picker` Recipe를 제공합니다. 접근성 이름은 각 `Column`의 `accessibility-label`로 지정합니다. 키보드·포커스 탐색은 지원하지 않습니다.

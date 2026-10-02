---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx에 Wheel Picker를 추가합니다. `WheelPicker.Root`·`WheelPicker.Column`·`WheelPicker.ItemLabel`은 React와 같은 `options`·`value`·`defaultValue`·`onValueChange`·`onIndexChange`·`loop`·`valueChangeBehavior`·`getAriaValueText`·`renderLabel`을 제공하고, 드래그·관성·정착은 `@seed-design/lynx-react-loop-scroll`이 Main Thread에서 처리합니다. Recipe `@seed-design/lynx-css/recipes/wheel-picker`를 추가합니다. 접근성 이름은 각 Column의 `accessibility-label`로 지정하며, 키보드·focus 탐색은 지원하지 않습니다.

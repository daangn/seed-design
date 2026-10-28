---
"@seed-design/react-text-field": minor
---

값을 비우는 `TextField.ClearButton`(`TextFieldClearButton`)을 추가합니다.

- native value setter와 `input` 이벤트로 값을 비우므로 `value`를 넘기지 않은 uncontrolled 상태에서도 동작하고, `onValueChange`가 빈 문자열과 함께 호출됩니다.
- 값이 비어 있으면 렌더링하지 않습니다. 입력의 focus는 원래 상태를 유지하며, 키보드로 누른 경우에는 focus를 입력으로 옮깁니다.
- `useTextFieldContext()`가 `inputRef`와 `clearButtonProps`를 함께 반환합니다.

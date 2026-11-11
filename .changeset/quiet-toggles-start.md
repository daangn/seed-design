---
"@seed-design/react-checkbox": patch
"@seed-design/react-switch": patch
"@seed-design/react-toggle": patch
---

Checkbox·Switch·Toggle Headless 훅을 `checked`·`defaultChecked`(Toggle은 `pressed`·`defaultPressed`) 없이 쓸 때 내부 상태가 `undefined`로 시작하던 문제를 수정해 `false`로 시작합니다.

- `useSwitch`의 `checked`와 `useToggle`의 `pressed`가 선언된 타입대로 `undefined` 대신 `false`를 반환합니다.
- 상호작용 전에 값을 `false`로 설정해도(Checkbox의 form reset 포함) 값이 바뀌지 않으므로 `onCheckedChange(false)`가 호출되지 않습니다.

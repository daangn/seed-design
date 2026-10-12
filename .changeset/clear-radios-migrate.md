---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `RadioGroup.Root`의 `value`·`defaultValue`·`onValueChange`·`disabled`를 바깥 `RadioGroupField.Root`로, `weight`·`size`·`tone`을 `RadioGroup.Item`으로 옮기고 `pressed`를 제거해야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:radio-group`와 `npx @seed-design/cli@latest add ui:select-box`로 다시 설치해야 합니다.)

`RadioGroup.Root`가 함께 맡던 선택 상태, 항목 스타일, 배치를 분리합니다.

- 이제 `RadioGroup.Root`는 항목 배치만 맡고, `RadioGroupField.Root`가 선택값과 `disabled` 상태를 제공합니다.
- `weight`·`size`·`tone`은 Root에서 모든 항목에 적용하는 대신 `RadioGroup.Item`마다 지정합니다.
- 외부에서 눌림 상태를 지정하던 `pressed` prop을 제거하고, 각 Item의 실제 눌림에 따라 효과를 표시합니다.
- Field 표현이 필요 없다면 `@seed-design/lynx-react-radio-group`의 `RadioGroup.Root`로 선택 상태를 관리할 수 있습니다.

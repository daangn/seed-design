---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `RadioGroup.Root`의 `value`·`defaultValue`·`onValueChange`·`disabled`를 바깥 `RadioGroupField.Root`로, `weight`·`size`·`tone`을 `RadioGroup.Item`으로 옮기고 `pressed`를 제거해야 합니다.) `RadioGroup.Root`는 항목 배치만 담당합니다. Field 표현이 필요 없다면 `@seed-design/lynx-react-radio-group`의 `RadioGroup.Root`로 선택 상태를 관리할 수 있습니다.

Registry 컴포넌트를 설치했다면 `npx @seed-design/cli@latest add ui:radio-group`와 `npx @seed-design/cli@latest add ui:select-box`로 해당 snippet을 다시 설치해야 합니다.

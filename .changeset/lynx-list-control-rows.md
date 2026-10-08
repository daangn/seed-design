---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `List.CheckboxItem`의 `size`·`variant`·`tone`을 `Checkbox.Control`로, `List.SwitchItem`의 `size`·`tone`을 `Switch.Control`로 옮기고 행의 `pressed`를 제거해야 합니다.) List 선택 행과 mark의 스타일을 따로 지정합니다. `List.CheckboxItem`의 `weight`는 제거하고, 글자 굵기가 필요하면 label의 `Text`에 직접 지정해야 합니다. `listItem` Recipe를 직접 조합한다면 제거된 `interactionRoot` wrapper 대신 실제 행의 `root`에 handler와 ref를 연결해야 합니다.

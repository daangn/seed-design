---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `List.CheckboxItem`의 `size`·`variant`·`tone`을 `Checkbox.Control`로, `List.SwitchItem`의 `size`·`tone`을 `Switch.Control`로 옮기고 행의 `pressed`를 제거해야 합니다. `List.CheckboxItem`의 `weight`는 제거하고, 글자 굵기가 필요하면 label의 `Text`에 직접 지정해야 합니다. `listItem` Recipe를 직접 조합한다면 `interactionRoot` wrapper를 제거하고 실제 행의 `root`에 handler와 ref를 연결해야 합니다.)

`List` 선택 행에서 선택 상태와 mark 모양을 분리하고, 행 자체를 조작하는 요소로 사용합니다.

- 이전에는 `CheckboxItem`·`SwitchItem`의 prop으로 mark 모양을 지정했습니다. 이제 행은 선택 상태를 관리하고, `Checkbox.Control`·`Switch.Control`이 각각 `size`·`tone`과 Checkbox의 `variant`를 받습니다.
- `CheckboxItem`이 받던 `weight`를 제거하며, label의 글자 굵기는 `Text`에서 지정합니다.
- 눌림 상태는 실제 터치에 따라 바뀌므로 행에 `pressed`를 직접 지정하지 않습니다.
- 선택 행 바깥의 `interactionRoot`를 제거하고, handler와 ref를 행의 `root`에 연결합니다. `seed-list-item__interactionRoot` class는 더 이상 생성되지 않습니다.

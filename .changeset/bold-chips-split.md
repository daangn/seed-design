---
"@seed-design/react": major
---

(BREAKING CHANGE: `Chip.Root`, `Chip.RootProps`, `ChipRoot`, `ChipRootProps`를 각각 `Chip.Button`, `Chip.ButtonProps`, `ChipButton`, `ChipButtonProps`로 바꿔야 합니다. `ui:chip` snippet도 다시 설치해야 합니다.) 버튼 Chip과 선택할 수 있는 Chip을 구분하도록 Chip API를 정리합니다.

- `Chip.Root`의 이름을 `Chip.Button`으로 바꿉니다. 동작과 스타일은 그대로입니다.
- 선택 상태를 토글하는 `Chip.Toggle`과, 여러 Chip 중 하나를 선택하는 `Chip.RadioRoot`·`Chip.RadioItem`과 각 Props 타입을 추가합니다. 2.x에서 `Chip.Root`에 `asChild`로 headless Checkbox나 Radio Group을 중첩하던 코드를 이 컴포넌트로 바꿀 수 있습니다.
- `ui:chip` snippet에서 `ChipBaseProps` 타입을 제거합니다. 이 타입을 가져왔다면 `ButtonChipProps`, `ToggleChipProps`, `RadioChipItemProps` 중 사용하는 컴포넌트에 맞는 타입으로 바꾸세요.

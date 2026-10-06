---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `Chip.Root`·`ChipRoot`와 Props 타입을 `Chip.Button`·`ChipButton`으로 바꿔야 합니다. `Chip.Toggle`의 이전 역할이 필요하면 `accessibility-role-description="toggle"`을 직접 전달하세요. tap handler에서 바뀐 선택 값을 읽던 코드는 `onCheckedChange`·`onValueChange`로 옮기세요.) Chip의 Toggle·Radio가 Checkbox·RadioGroup Headless의 동작을 따릅니다.

- `Chip.Toggle`의 기본 `accessibility-role-description`이 `"checkbox"`입니다.
- `Chip.RadioRoot`가 `radiogroup` 역할의 접근성 요소가 되고, `disabled`이면 `accessibility-traits` 기본값이 `"disabled"`입니다.
- `Chip.Toggle`·`Chip.RadioItem`의 `bindtap`이 선택 상태를 바꾸기 전에 호출됩니다.

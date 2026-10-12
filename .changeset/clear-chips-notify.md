---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Chip.Toggle`의 변경된 선택값을 사용하는 `bindtap` 작업은 `onCheckedChange(next)`로, `Chip.RadioItem`의 작업은 상위 `Chip.RadioRoot`의 `onValueChange(next)`로 옮겨야 합니다.)

`Chip.Toggle`·`Chip.RadioItem`의 callback 호출 순서를 변경합니다.

- 이전에는 선택 상태를 바꾼 뒤 `bindtap`을 호출했지만, 이제 `bindtap`을 먼저 호출한 뒤 선택 상태를 바꾸고 `onCheckedChange`·`onValueChange`로 새 값을 전달합니다.

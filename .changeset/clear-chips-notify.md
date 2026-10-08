---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: Chip.Toggle의 변경된 선택값을 사용하는 `bindtap` 작업은 `onCheckedChange(next)`로, Chip.RadioItem의 작업은 상위 `Chip.RadioRoot`의 `onValueChange(next)`로 옮겨야 합니다.) `Chip.Toggle`·`Chip.RadioItem`의 `bindtap`을 선택 상태 변경 전에 호출합니다.

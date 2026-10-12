---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `ReactionButton`의 변경된 선택값을 사용하는 `bindtap` 작업은 `onPressedChange(next)`로 옮겨야 합니다.)

`ReactionButton`의 탭 처리 순서를 선택값 변경 후 `bindtap` 호출에서 `bindtap` 호출 후 선택값 변경으로 바꿉니다.

- `bindtap`을 `onPressedChange`보다 먼저 호출하므로, 변경된 선택값은 `onPressedChange(next)`에서 받습니다.
- `disabled` 또는 `loading`이면 `bindtap`과 `onPressedChange` 모두 호출하지 않습니다.
- 선택 상태를 `selected` trait로 알리던 기본 접근성을 toggle button의 `"pressed"`·`"not pressed"` 안내로 변경합니다.

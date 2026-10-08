---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: ReactionButton의 변경된 선택값을 사용하는 `bindtap` 작업은 `onPressedChange(next)`로 옮겨야 합니다.) `ReactionButton`의 `bindtap`을 `onPressedChange`보다 먼저 호출합니다. `disabled` 또는 `loading`이면 두 callback 모두 호출하지 않습니다.

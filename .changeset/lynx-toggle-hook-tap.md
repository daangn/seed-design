---
"@seed-design/lynx-react-toggle": minor
---

`useToggle`에 `bindtap`·`main-thread:bindtap`·`main-thread:bindtouchstart`·`main-thread:bindtouchend`·`main-thread:bindtouchcancel`을 지정할 수 있습니다. `bindtap`은 선택 상태 변경 전에 호출하며, `disabled`이면 tap handler와 선택 변경을 막습니다. 반환하는 `rootProps`에는 toggle button의 접근성 역할과 `"pressed"`·`"not pressed"` 상태도 포함합니다.

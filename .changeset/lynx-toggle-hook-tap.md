---
"@seed-design/lynx-react-toggle": minor
---

`useToggle`에 사용자 tap·touch handler를 지정해 커스텀 동작과 선택 상태 전환을 함께 처리할 수 있습니다.

- `bindtap`·`main-thread:bindtap`·`main-thread:bindtouchstart`·`main-thread:bindtouchend`·`main-thread:bindtouchcancel`을 지원합니다.
- `bindtap`은 선택 상태 변경 전에 호출하며, `disabled`이면 tap handler와 선택 변경을 막습니다.
- 이전에는 이벤트 handler만 제공하던 `rootProps`에 toggle button의 접근성 역할과 `"pressed"`·`"not pressed"` 상태를 추가합니다.

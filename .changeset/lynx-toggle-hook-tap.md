---
"@seed-design/lynx-react-toggle": minor
---

`useToggle`이 `bindtap`·`main-thread:bindtap`을 받아 `rootProps`로 연결합니다. 사용자 `bindtap`은 pressed 전이보다 먼저 실행되고, `disabled`이면 두 handler 모두 실행되지 않습니다. `rootProps`는 `accessibility-element`·`accessibility-traits`(`disabled`이면 `"disabled"`)·`accessibility-role-description`·`accessibility-value` 기본값도 포함하므로, 뒤에 펼친 props로 덮어쓸 수 있습니다. `Toggle.Root`는 이 `rootProps`를 사용하며 동작은 같습니다.

---
"@seed-design/lynx-react-use-press-tap": patch
---

`usePressTap`이 `disabled`로 바뀐 뒤 탭할 때마다 `MainThreadFunction: Invalid function object` 경고를 남기던 문제를 수정합니다. `main-thread:bindtap`을 연결한 채로 두고, `disabled`인 동안에는 소비자 handler를 호출하지 않습니다.

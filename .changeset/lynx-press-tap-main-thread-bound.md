---
"@seed-design/lynx-react-use-press-tap": patch
---

`usePressTap`이 `disabled`로 바뀐 뒤 탭할 때마다 `MainThreadFunction: Invalid function object` 경고를 남기던 문제를 수정해, 비활성 상태의 탭을 callback 호출이나 경고 없이 무시합니다.

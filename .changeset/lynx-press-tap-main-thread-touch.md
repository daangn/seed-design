---
"@seed-design/lynx-react-use-press-tap": minor
"@seed-design/lynx-react-toggle": patch
---

`usePressTap`에 `mainThreadOnTouchStart`·`mainThreadOnTouchEnd`·`mainThreadOnTouchCancel`을 추가합니다. 소비자의 `main-thread:bindtouch*` handler를 실행한 뒤 눌림 상태를 갱신하는 handler를 반환하므로, Main Thread touch handler를 함께 써도 눌림 상태가 유지됩니다. Toggle Root에 `main-thread:bindtouch*`를 넘기면 `active`가 켜지지 않던 문제도 함께 고칩니다.

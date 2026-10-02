---
"@seed-design/lynx-react-use-press-tap": minor
"@seed-design/lynx-react-toggle": patch
---

`usePressTap`에 `mainThreadOnTouchStart`·`mainThreadOnTouchEnd`·`mainThreadOnTouchCancel`을 추가합니다. 소비자의 `main-thread:bindtouch*` handler를 실행한 뒤 눌림 상태를 갱신하는 handler를 반환합니다. Toggle Root는 소비자의 `main-thread:bindtouch*`를 이 합성 handler로 연결합니다.

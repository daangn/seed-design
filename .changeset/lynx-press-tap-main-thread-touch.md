---
"@seed-design/lynx-react-use-press-tap": minor
---

`usePressTap`에 커스텀 터치 동작과 눌림 상태 관리를 함께 사용할 수 있는 callback을 추가합니다.

- `mainThreadOnTouchStart`·`mainThreadOnTouchEnd`·`mainThreadOnTouchCancel`을 지정할 수 있습니다.
- 반환하는 `main-thread:bindtouchstart`·`main-thread:bindtouchend`·`main-thread:bindtouchcancel` handler는 지정한 callback을 호출한 뒤 눌림 상태를 갱신합니다.

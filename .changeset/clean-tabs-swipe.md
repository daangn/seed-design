---
"@seed-design/lynx-react-tabs": patch
"@seed-design/lynx-react": patch
"@seed-design/lynx-css": patch
---

Lynx `Tabs`를 스와이프할 때 Android logcat에 `illegal css key` 오류가 반복되던 문제를 수정합니다.

- Headless `Tabs.Indicator`는 `--tabs-indicator-x`·`--tabs-indicator-width` 변수 대신 inline `transform`·`width`(px)로 위치와 폭을 지정합니다.

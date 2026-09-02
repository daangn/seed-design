---
"@seed-design/css": patch
"@seed-design/lynx-css": patch
---

컴포넌트 vars의 gradient가 문자열 대신 `{ serialized, stops? }` 객체로 제공됩니다.

- `serialized`: 기존과 동일한 CSS gradient 문자열입니다. `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient.serialized})`처럼 사용합니다.
- `stops`: `{ color, position }` 배열로, position이 0~1 원본 값이라 stop마다 `calc()`로 위치를 계산하는 등 동적으로 다룰 수 있습니다. 테마별로 값이 다른 gradient에는 제공되지 않습니다.
- 생성되는 CSS는 이전과 동일합니다.

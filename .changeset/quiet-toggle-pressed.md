---
"@seed-design/react-toggle": patch
"@seed-design/react": patch
---

`pressed`, `defaultPressed` 없이 쓰는 Toggle의 초기 상태를 `false`로 맞춥니다. `useToggle`의 `pressed`가 `undefined` 대신 `false`를 반환합니다.

---
"@seed-design/css": patch
"@seed-design/lynx-css": patch
---

`vars/component/*` 타입에 `@internal` 안내 주석이 추가됩니다.

- `typography`를 제외한 컴포넌트 vars는 SEED가 컴포넌트 스타일을 만들 때 쓰는 내부 값이라 SemVer 보장 대상이 아닙니다. 이제 해당 경로를 import하면 에디터 hover에서 바로 확인할 수 있고, 대신 쓸 것(`recipes/*`, 디자인 토큰)도 함께 안내합니다.
- 타입 주석만 추가되며, 런타임 값과 생성되는 CSS는 이전과 동일합니다.

---
"@seed-design/lynx-react": patch
"@seed-design/lynx-css": patch
---

Lynx BottomSheet, Checkbox, Switch의 플랫폼 동작을 개선합니다.

- BottomSheet Content는 host safe area 값을 기본 하단 padding으로 사용합니다.
- Checkbox/Switch는 긴 label에서도 control mark가 위쪽에 유지됩니다.
- lynx-react의 직접 peer contract를 `@seed-design/lynx-css`, `@lynx-js/react`, `@lynx-js/types` 기준으로 정리합니다.

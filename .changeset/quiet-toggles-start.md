---
"@seed-design/react-checkbox": patch
"@seed-design/react-switch": patch
"@seed-design/react": patch
---

`checked`, `defaultChecked` 없이 쓰는 Checkbox, Switch의 초기 상태를 `false`로 맞춥니다.

- Checkbox: 값이 바뀌기 전에 `setChecked(false)`를 호출하거나 상위 form이 reset되면 `onCheckedChange(false)`가 불필요하게 호출되던 문제를 수정합니다. `@seed-design/react`의 Checkbox, Chip, List, CheckSelectBox에도 적용됩니다.
- Switch: `useSwitch`의 `checked`가 `undefined` 대신 `false`를 반환합니다. 값이 바뀌기 전에 `setChecked(false)`를 호출해도 `onCheckedChange(false)`가 호출되지 않습니다.

---
"@seed-design/tailwind3-plugin": minor
"@seed-design/migration-index": minor
"@seed-design/tailwind4-theme": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/css": minor
---

시맨틱 stroke 컬러 토큰을 업데이트합니다.

- 이름이 변경되는 stroke 토큰

| 기존              | 신규              | 비고 |
| ----------------- | ----------------- | ---- |
| **neutral-muted** | neutral-subtle    |
| neutral           | **neutral-muted** |
| field-focused     | neutral-contrast  |
| control           | neutral-weak      |
| brand             | brand-weak        |
| positive          | positive-weak     |
| informative       | informative-weak  |
| warning           | warning-weak      |
| critical          | critical-weak     |
| on-image          | neutral-subtle    | 병합 |
| field             | neutral-weak      | 병합 |

- 색상이 변경되는 stroke 토큰

`$color.stroke.neutral-contrast` (이름 변경 전 `$color.stroke.field-focused`): 모든 theme mode에서 `$color.palette.gray-800` → `$color.palette.gray-1000`

- 신규 stroke 토큰

| 신규              |
| ----------------- |
| neutral-solid     |
| brand-solid       |
| positive-solid    |
| informative-solid |
| warning-solid     |
| critical-solid    |

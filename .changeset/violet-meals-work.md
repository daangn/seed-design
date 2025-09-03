---
"@seed-design/tailwind3-plugin": minor
"@seed-design/migration-index": minor
"@seed-design/tailwind4-theme": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/css": minor
---

시맨틱 stroke 컬러 토큰을 업데이트합니다. 이름이 변경되는 stroke 토큰을 사용하고 있는 경우, 간단한 마이그레이션이 필요합니다.

- 이름이 변경되는 stroke 토큰

| 기존                            | 신규                            | 비고                               |
| ------------------------------- | ------------------------------- | ---------------------------------- |
| **$color.stroke.neutral-muted** | $color.stroke.neutral-subtle    | 가장 먼저 마이그레이션해야 합니다. |
| $color.stroke.on-image          | $color.stroke.neutral-subtle    |
| $color.stroke.neutral           | **$color.stroke.neutral-muted** |
| $color.stroke.field-focused     | $color.stroke.neutral-contrast  |
| $color.stroke.control           | $color.stroke.neutral-weak      |
| $color.stroke.field             | $color.stroke.neutral-weak      |
| $color.stroke.brand             | $color.stroke.brand-weak        |
| $color.stroke.positive          | $color.stroke.positive-weak     |
| $color.stroke.informative       | $color.stroke.informative-weak  |
| $color.stroke.warning           | $color.stroke.warning-weak      |
| $color.stroke.critical          | $color.stroke.critical-weak     |

- 색상이 변경되는 stroke 토큰 (마이그레이션 불필요)

`$color.stroke.neutral-contrast` (이름 변경 전 `$color.stroke.field-focused)

모든 theme mode에서 `$color.palette.gray-800` → `$color.palette.gray-1000`로 변경되었습니다.

- 신규 stroke 토큰 (마이그레이션 불필요)

| 신규                            |
| ------------------------------- |
| $color.stroke.neutral-solid     |
| $color.stroke.brand-solid       |
| $color.stroke.positive-solid    |
| $color.stroke.informative-solid |
| $color.stroke.warning-solid     |
| $color.stroke.critical-solid    |

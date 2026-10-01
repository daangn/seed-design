---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": minor
---

SEED 컴포넌트가 `$color.bg.neutral-inverted` 대신 같은 값의 `$color.bg.neutral-solid`를 사용하도록 변경하고, `$color.bg.neutral-inverted`와 `$color.bg.neutral-inverted-pressed`를 deprecated로 표시합니다.

- `@seed-design/react`의 Date Picker를 포함한 기존 사용처는 같은 색상 값을 가진 `$color.bg.neutral-solid`를 사용합니다.
- 기존 사용처의 하위 호환성을 위해 `$color.bg.neutral-inverted`, `$color.bg.neutral-inverted-pressed`와 이에 대응하는 CSS 변수를 유지하며, 각 패키지의 다음 major 버전에서 제거할 예정입니다.

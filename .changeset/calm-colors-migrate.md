---
"@seed-design/css": major
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": major
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
---

`$color.bg.neutral-inverted` 사용처를 `$color.bg.neutral-solid`로 변경하고, 기존 토큰은 deprecated 상태로 유지합니다.

- Date Picker를 포함한 기존 사용처는 동일한 색상 값을 가진 `$color.bg.neutral-solid`을 사용합니다.
- 서버 토큰 마이그레이션의 하위 호환성을 위해 `$color.bg.neutral-inverted`와 이에 대응하는 CSS 변수 및 Tailwind 토큰을 유지합니다.
- deprecated 토큰은 `@seed-design/css@4.0.0`에서 제거될 예정입니다.

---
"@seed-design/css": major
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": major
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
---

(BREAKING CHANGE: `$color.bg.neutral-inverted` 사용처를 `$color.bg.neutral-solid`로 변경해야 합니다.) Neutral Inverted 배경 색상 토큰을 제거합니다.

- `$color.bg.neutral-inverted`와 이에 대응하는 CSS 변수 및 Tailwind 토큰을 제거합니다.
- Date Picker를 포함한 기존 사용처는 동일한 색상 값을 가진 `$color.bg.neutral-solid`을 사용합니다.

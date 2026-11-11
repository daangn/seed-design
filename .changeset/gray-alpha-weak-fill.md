---
"@seed-design/rootage-artifacts": minor
"@seed-design/css": minor
"@seed-design/lynx-css": minor
---

`$color.bg.neutral-weak-alpha`와 `$color.bg.neutral-weak-alpha-pressed`가 gray 램프와 톤이 일치하는 `gray-alpha` 팔레트를 사용하도록 바꿉니다.

- `bg.neutral-weak-alpha`: `static-black-alpha-200`(light) / `static-white-alpha-200`(dark) → `gray-alpha-200`
- `bg.neutral-weak-alpha-pressed`: `static-black-alpha-300`(light) / `static-white-alpha-300`(dark) → `gray-alpha-300`
- 명도는 거의 같고 색조만 gray 램프에 맞춰집니다. Chip(`variant=solid`), Chip Tabs(`neutralSolid`), Segmented Control, Side Navigation 스크롤바의 배경색이 함께 바뀝니다.

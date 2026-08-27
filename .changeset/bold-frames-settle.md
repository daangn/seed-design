---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": patch
---

Select Box와 `variant="separated"` Accordion Item의 border 색을 `$color.stroke.neutral-muted`에서 `$color.stroke.neutral-weak`로 변경합니다.

- Select Box는 enabled와 disabled 상태의 border 색이 함께 바뀝니다. selected 상태의 `$color.stroke.neutral-contrast`는 그대로입니다.
- Accordion은 border를 가진 `variant="separated"`만 영향을 받습니다. `variant="inline"`의 divider 색은 그대로입니다.
- border 색이 light 테마에서 `#00000010`(알파 6%) → `#dcdee3`, dark 테마에서 `#ffffff17`(알파 9%) → `#393d46`으로 바뀌어 또렷해집니다. 두 테마 모두 색이 있는 배경 위에 올려 쓰던 화면은 대비를 확인해 주세요.

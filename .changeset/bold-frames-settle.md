---
"@seed-design/css": major
"@seed-design/rootage-artifacts": major
"@seed-design/lynx-css": patch
---

(BREAKING CHANGE: Select Box와 Accordion의 border가 또렷해지므로 사용처의 시각 확인이 필요합니다.) Select Box와 `variant="separated"` Accordion Item의 border 색을 `$color.stroke.neutral-muted`에서 `$color.stroke.neutral-weak`로 변경합니다.

- Select Box는 enabled와 disabled 상태의 border 색이 함께 바뀝니다. selected 상태의 `$color.stroke.neutral-contrast`는 그대로입니다.
- Accordion은 border를 가진 `variant="separated"`만 영향을 받습니다. `variant="inline"`의 divider 색은 그대로입니다.
- light 테마에서 알파 색(`#00000010`)이 불투명 회색(`#dcdee3`)으로 바뀌어 border가 또렷해집니다. 색이 있는 배경 위에 올려 쓰던 화면은 대비를 확인해 주세요.
- css 소비 패키지는 peer/deps를 `^N+1`로 올려야 합니다.

---
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `reactionButton({ pressed })`의 `pressed`와 `reactionButtonVariantMap.pressed` 사용을 제거해야 합니다.)

`reaction-button` Recipe의 눌림 색상을 `pressed` variant 대신 `:active` 상태로 적용합니다.

- 선택 여부에 따른 눌림 색은 그대로 제공하며, `ReactionButton` 컴포넌트의 선택 상태를 제어하는 `pressed` prop도 유지합니다.

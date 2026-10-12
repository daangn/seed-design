---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `badge({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `Badge`에 눌림 효과가 필요하면 `ScaleFeedback`을 별도로 적용해야 합니다.)

`Badge.Action`의 눌림 축소 효과를 recipe의 `pressed` variant 대신 실제 눌림 동작에 맞춰 적용합니다.

- 이전에는 `pressed` variant와 그 class로 축소를 지정했지만, 이제 recipe에서 이 variant와 class를 제거합니다.
- `Badge.Action` 컴포넌트는 눌렀을 때 자동으로 축소되며, `GlobalProps.motion="reduced"`이면 축소되지 않습니다.

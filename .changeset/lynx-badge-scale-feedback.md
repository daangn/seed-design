---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `badge({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `Badge`에 눌림 효과가 필요하면 `ScaleFeedback`을 별도로 적용해야 합니다.) Lynx `Badge.Action`이 눌렀을 때 축소되고, `GlobalProps.motion`이 `"reduced"`이면 축소되지 않도록 변경합니다.

---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Checkbox.Root`의 `pressed`, `checkmark({ pressed })`의 `pressed`, `checkmarkVariantMap.pressed` 사용을 제거해야 합니다.) Checkbox의 눌림 색상을 Root의 `:active` 상태로 적용합니다. `checkmark` Recipe로 ghost mark를 직접 조합한다면 기존 `background`와 함께 `selectedBackground` slot도 렌더링해야 합니다.

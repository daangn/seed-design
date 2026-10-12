---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Checkbox.Root`의 `pressed`, `checkmark({ pressed })`의 `pressed`, `checkmarkVariantMap.pressed` 사용을 제거해야 합니다. `checkmark` Recipe로 ghost mark를 직접 조합한다면 기존 `background`와 함께 `selectedBackground` slot도 렌더링해야 합니다.)

Checkbox의 눌림 색상을 `pressed` prop과 Recipe variant 대신 Root의 `:active` 상태로 적용합니다.

- ghost mark는 이전에 하나의 `background`로 선택 여부에 따른 눌림 배경을 그렸지만, 이제 미선택용 `background`와 선택·indeterminate용 `selectedBackground`를 따로 사용합니다.

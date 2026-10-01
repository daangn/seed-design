---
"@seed-design/css": major
---

(BREAKING CHANGE: `wheel-picker-public` 스타일 참조를 `wheel-picker`로 바꾸고, 제거된 Date Picker·Time Picker 휠 클래스를 참조했다면 `.seed-wheel-picker__*` 클래스 기준으로 다시 지정해야 합니다.) Wheel Picker 스타일을 하나로 통합합니다.

- `@seed-design/css/recipes/wheel-picker-public`을 사용했다면 `@seed-design/css/recipes/wheel-picker`로 바꾸고, `seed-wheel-picker-public` 클래스와 `--seed-wheel-picker-public-*` CSS 변수에서 `public`을 제거하세요.
- Date Picker와 Time Picker 안의 휠은 Wheel Picker 스타일을 그대로 사용합니다. 이에 따라 `@seed-design/css/recipes/date-picker`의 `wheelColumns`, `wheelSelectionIndicator`, `wheelScrollFog`, `wheelItem` slot과 `@seed-design/css/recipes/time-picker`의 `scrollFog`, `columns`, `selectionIndicator` slot을 제거합니다. 해당 클래스(`.seed-date-picker__wheelItem`, `.seed-time-picker__selectionIndicator` 등)로 스타일을 덮어썼다면 `.seed-wheel-picker__*` 클래스를 기준으로 다시 지정하세요.
- `.seed-wheel-picker__*` 클래스와 `--seed-wheel-picker-*` CSS 변수는 2.x에서 Date Picker·Time Picker 안의 휠에만 적용되었지만, 이제 모든 Wheel Picker에 적용됩니다.
- Week Date Picker의 연·월 Wheel Picker를 표시하는 `wheelPositioner`, `wheelPopover` slot을 `@seed-design/css/recipes/date-picker`에 추가합니다.

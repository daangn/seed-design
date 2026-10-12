---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Chip.Toggle`의 이전 역할을 유지하려면 `accessibility-role-description="toggle"`을 직접 지정하고, `Chip.RadioRoot`를 접근성 요소로 안내하지 않으려면 `accessibility-element={false}`를 지정해야 합니다.)

`Chip.Toggle`과 `Chip.RadioRoot`의 기본 접근성 역할을 변경합니다.

- `Chip.Toggle`의 기본 `accessibility-role-description`을 `"toggle"`에서 `"checkbox"`로 변경합니다.
- 이전에는 별도 접근성 기본값이 없던 `Chip.RadioRoot`를 `"radiogroup"` 역할의 접근성 요소로 안내하며, `disabled`이면 기본 `accessibility-traits`는 `"disabled"`입니다.

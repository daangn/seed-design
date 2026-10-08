---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: Chip.Toggle의 이전 역할을 유지하려면 `accessibility-role-description="toggle"`을 직접 지정하고, Chip.RadioRoot를 접근성 요소로 안내하지 않으려면 `accessibility-element={false}`를 지정해야 합니다.) `Chip.Toggle`의 기본 접근성 역할을 `"checkbox"`로 변경합니다. `Chip.RadioRoot`는 기본적으로 `"radiogroup"` 역할의 접근성 요소이며, `disabled`이면 `accessibility-traits="disabled"`로 안내합니다.

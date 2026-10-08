---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: indeterminate Checkbox에서 이전 접근성 안내를 유지하려면 `accessibility-value`를 직접 지정해야 합니다.) `Checkbox.Root`의 `indeterminate` 상태는 `checked` 값과 관계없이 기본 `accessibility-value`로 `"mixed"`를 전달합니다.

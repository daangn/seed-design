---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: indeterminate Checkbox에서 이전 접근성 안내를 유지하려면 `accessibility-value`를 직접 지정해야 합니다.)

`Checkbox.Root`의 `indeterminate` 상태를 기본 접근성 값 `"mixed"`로 안내합니다.

- 이전에는 `indeterminate`여도 `checked`에 따라 `"checked"` 또는 `"not checked"`를 전달했습니다. 이제 `checked` 값과 관계없이 `"mixed"`를 전달합니다.
- 직접 지정한 `accessibility-value`는 기본값보다 우선합니다.

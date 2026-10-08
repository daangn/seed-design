---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: CheckSelectBox의 이전 접근성 안내가 필요하면 `accessibility-value`를 직접 지정해야 합니다.) `CheckSelectBox.Root`의 기본 `accessibility-value`를 `"selected"`·`"not selected"`에서 `"checked"`·`"not checked"`로 변경합니다. `indeterminate` 상태는 `"mixed"`로 안내합니다.

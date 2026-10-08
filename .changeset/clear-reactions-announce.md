---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: ReactionButton의 이전 접근성 안내가 필요하면 `accessibility-role-description`·`accessibility-value`·`accessibility-traits`를 직접 지정해야 합니다.) `ReactionButton`의 선택 상태를 `accessibility-traits="selected"` 대신 `accessibility-role-description="toggle button"`과 `accessibility-value="pressed"`·`"not pressed"`로 안내합니다. `disabled` 또는 `loading`이면 기본 `accessibility-traits`는 `"disabled"`이며, 직접 지정한 값은 그대로 사용합니다.

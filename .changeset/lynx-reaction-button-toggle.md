---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: ReactionButton tap 시 사용자 `bindtap`이 `onPressedChange`보다 먼저 실행됩니다. 선택 상태는 `accessibility-traits="selected"` 대신 `accessibility-role-description="toggle button"`과 `accessibility-value`(`"pressed"`/`"not pressed"`)로 알리고, `loading`이면 `accessibility-traits`를 `"disabled"`로 알립니다. 직접 전달한 `accessibility-traits`는 `disabled`·`loading`에서도 그대로 씁니다. 이전 값이 필요하면 해당 `accessibility-*` 속성을 직접 전달하세요.) Lynx ReactionButton이 `@seed-design/lynx-react-toggle`의 `useToggle`로 pressed 전이·눌림 상태·tap을 처리합니다. `disabled`·`loading` 중 tap과 `onPressedChange` 차단, Recipe 표현과 Scale Feedback은 유지합니다.

---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: List 선택 행의 이전 접근성 안내가 필요하면 `accessibility-value`와 `accessibility-traits`를 직접 지정해야 합니다.) `List.CheckboxItem`·`List.RadioItem`·`List.SwitchItem`을 각각 하나의 접근성 요소로 안내합니다.

- Checkbox의 기본 `accessibility-value`는 `"선택됨"`·`"선택 안 됨"` 대신 `"checked"`·`"not checked"`이며, `indeterminate`이면 `"mixed"`입니다.
- Radio의 기본 `accessibility-value`는 `"선택됨"`·`"선택 안 됨"` 대신 `"selected"`·`"not selected"`입니다.
- Switch의 기본 `accessibility-value`는 `"켜짐"`·`"꺼짐"` 대신 `"checked"`·`"not checked"`입니다.
- 활성 상태의 기본 `accessibility-traits="button"`을 제거합니다.

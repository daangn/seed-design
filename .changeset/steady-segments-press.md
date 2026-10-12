---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `segmentedControl({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `SegmentedControl`에는 `itemSelectedBackground` slot을 추가해야 합니다.)

Lynx `SegmentedControl`의 눌림 배경을 선택 상태별로 분리해, 선택이 바뀌는 순간 사라지는 배경의 색도 바뀌던 문제를 수정합니다.

- 이전에는 하나의 `itemBackground`에서 선택 상태에 따라 눌림 색을 바꿨지만, 이제 미선택용 `itemBackground`와 선택용 `itemSelectedBackground`에 각각 색을 고정합니다.
- `pressed` Recipe variant를 제거하고, Item의 `:active` 상태에서 선택 여부에 맞는 배경을 표시합니다.

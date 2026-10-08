---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `segmentedControl({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `SegmentedControl`에는 `itemSelectedBackground` slot을 추가해야 합니다.) Lynx `SegmentedControl`이 선택 변경 전후에 같은 눌림 색을 표시하도록 변경합니다.

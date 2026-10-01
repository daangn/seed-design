---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

(BREAKING CHANGE: `segmented-control` Recipe의 `pressed` variant를 제거하고 `itemSelectedBackground` slot을 추가합니다. `segmentedControl({ pressed })`를 쓰던 코드는 `pressed`를 지워야 합니다.) Lynx SegmentedControl의 눌림 색을 Main Thread `:active`로만 적용합니다. 놓는 순간 선택이 바뀌어도 사라지는 눌림 색이 바뀌지 않습니다. 첫 진입 때 Indicator가 서서히 나타나지 않도록 Recipe에 `transitionEnabled` variant를 추가하고, Item 등록 다음 업데이트부터 Indicator transition을 켭니다.

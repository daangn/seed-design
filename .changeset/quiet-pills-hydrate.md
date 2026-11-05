---
"@seed-design/css": patch
"@seed-design/react-segmented-control": patch
---

`SegmentedControl`을 서버 렌더링하면 hydration 직후 선택 indicator가 왼쪽에서 미끄러져 들어오던 문제를 수정합니다. `SegmentedControlRoot`는 마운트 전까지 `data-ssr` 속성을 가지며, 그동안 indicator를 숨기고 선택된 `SegmentedControlItem`에 indicator와 같은 배경을 표시합니다. 마운트 뒤에는 indicator가 애니메이션 없이 제자리에 나타나고, 이후 선택을 바꿀 때의 애니메이션은 그대로입니다.

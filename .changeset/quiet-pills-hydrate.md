---
"@seed-design/css": patch
"@seed-design/react-segmented-control": patch
---

서버 렌더링한 `SegmentedControl`이 hydration 직후 선택 indicator를 왼쪽에서 미끄러지듯 움직이던 문제를 수정합니다. hydration 전에는 선택된 항목에 indicator와 같은 배경을 표시하고, hydration 뒤에는 애니메이션 없이 제자리에 indicator를 표시합니다.

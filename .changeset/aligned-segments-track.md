---
"@seed-design/lynx-css": patch
---

Lynx `SegmentedControl`의 폭이 항목 최소 폭보다 좁을 때 선택 Indicator가 선택 항목과 어긋나던 문제를 수정합니다.

- 항목을 더 좁게 써야 하면 Root `style`에서 `--segment-min-width`를 지정합니다. Item과 Indicator에 같은 최소 폭이 적용됩니다.

---
"@seed-design/lynx-react": patch
---

Lynx `ProgressCircle`에서 `size` 변경이 애니메이션에 즉시 반영되도록 수정합니다.

- 같은 `ProgressCircle` 인스턴스에서 `size`가 변경될 때 이전 크기의 애니메이션 geometry가 남지 않도록 개선합니다.

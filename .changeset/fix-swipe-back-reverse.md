---
"@seed-design/stackflow": patch
---

AppScreen 스와이프 백 제스처가 좌→우 단방향으로만 동작하도록 수정합니다.

- 스와이프 백 중 초기 위치보다 왼쪽(역방향)으로 드래그할 수 없도록 수정합니다.
- `onSwipeBackMove` 콜백의 `displacement` 및 `displacementRatio` 값이 항상 0 이상으로 전달되도록 수정합니다.

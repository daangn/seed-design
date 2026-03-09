---
"@seed-design/react-pull-to-refresh": patch
---

`pulling` 및 `ready` 상태에서 손가락을 위로 올려 `displacement`가 0 이하가 될 때 즉시 `idle` 상태로 복귀하도록 수정합니다.

- `moveEvent`에서 `displacement <= 0` 조건 시 `idle` bail-out 추가
- `setContext`에서 `displacement`를 `Math.max(0, displacement)`로 clamp하여 CSS 변수가 음수가 되지 않도록 방어

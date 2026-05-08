---
"@seed-design/css": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/stackflow": patch
---

Top Navigation과 AppBar의 `divider` 옵션을 deprecated 처리합니다.

- 1.x에서는 기존 `divider` 동작을 유지하므로 하단 stroke가 바로 사라지지 않습니다.
- `divider` 옵션은 2.0.0에서 제거될 예정입니다. 새 코드에서는 `divider` prop 또는 `appBar({ divider })` 사용을 제거하세요.

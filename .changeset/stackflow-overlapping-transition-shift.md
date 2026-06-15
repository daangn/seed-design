---
"@seed-design/stackflow": patch
---

전환 애니메이션이 겹쳤을 때(동시 `pop()`, 빠른 백버튼·swipe-back 등) 착지 화면이 약 1/3 왼쪽으로 밀리거나 AppBar가 보이지 않던 렌더링 깨짐을 방지합니다. 전환이 정착(`globalTransitionState === "idle"`)하면 top 화면에 남은 임시 스타일(layer 위치, AppBar 표시 등)을 정리해 항상 기본 상태로 놓이도록 보장합니다. pop 개수 동작(`pop(2)`, `pop(); pop();` 등)은 stackflow 기본 동작 그대로입니다.

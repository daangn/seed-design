---
"@seed-design/stackflow": patch
---

전환 애니메이션이 겹쳤을 때(동시 `pop()`, 빠른 swipe-back 등) 착지 화면이 약 1/3 왼쪽으로 밀려 보이던 렌더링 깨짐을 방지합니다. 전환이 정착(`globalTransitionState === "idle"`)하면 top 화면의 layer가 항상 0% 위치에 놓이도록 보장합니다. pop 개수 동작(`pop(2)`, `pop(); pop();` 등)은 stackflow 기본 동작 그대로입니다.

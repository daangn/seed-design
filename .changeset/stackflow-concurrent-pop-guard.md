---
"@seed-design/stackflow": patch
---

전환(transition) 애니메이션이 진행 중일 때 들어온 `pop()`이 exit 애니메이션을 겹치게 만들어 화면이 깨지던 문제를 방지합니다. 진행 중에 들어온 추가 pop은 애니메이션 없이 즉시 제거로 처리되어, 닫히는 화면 수는 그대로 유지되면서(`pop(); pop();` ≡ `pop(2)`) 동시에 애니메이션되는 exit는 항상 한 개로 유지됩니다. `@stackflow/plugin-basic-ui`와 닫히는 화면 수가 동일합니다.

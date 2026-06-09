---
"@seed-design/stackflow": patch
---

전환(transition) 애니메이션이 진행 중일 때 들어온 중복 `pop()` 호출을 방지합니다. 이전에는 하나의 `pop()`이 애니메이션되는 동안 또 다른 `pop()`(백버튼 연타 또는 프로그래매틱 호출)이 들어오면 의도보다 많은 Activity가 닫히거나 exit 애니메이션이 중첩되어 화면이 깨질 수 있었습니다.

`seedPlugin`이 `onBeforePop`에서 이미 exit 중인 Activity가 있으면 추가 `pop()`을 무시합니다. `pop(count)`처럼 한 번에 여러 Activity를 닫는 호출은 그대로 정상 동작합니다.

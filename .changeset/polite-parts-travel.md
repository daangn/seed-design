---
"@seed-design/stackflow": patch
---

AppScreen 스와이프 중 취소 시 트랜지션이 끝난 뒤에도 `GlobalInteraction`의 `data-swipe-back-state`가 `idle`로 되돌아가지 않고 `canceling`으로 남아 있는 문제를 수정합니다.

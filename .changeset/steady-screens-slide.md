---
"@seed-design/stackflow": patch
---

Stackflow AppScreen의 pop 전환에서 중첩된 exit activity 스타일 정리를 개선합니다.

- 연속 `pop()` 호출로 여러 activity가 동시에 exit 상태가 될 때, 다시 보여질 화면의 inline style이 남아 화면이 밀려 보일 수 있는 케이스를 줄입니다.
- 빠른 뒤로가기 중 중간 exit 화면이 AppScreen 전환 대상처럼 처리되어 화면 일부가 잘려 보이는 현상을 완화합니다.

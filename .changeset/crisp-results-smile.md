---
"@seed-design/react-drawer": patch
---

AlertDialog 닫힐 때 focus 복원으로 인해 BottomSheet가 즉시 닫히는 문제 수정

- onFocusOutside에서 항상 preventDefault 호출
- onInteractOutside에서 defaultPrevented 체크 추가

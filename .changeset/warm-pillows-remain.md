---
"@seed-design/react-drawer": patch
"@seed-design/css": patch
---

BottomSheet `showCloseButton` variant 변경 및 animation 버그 수정

- `showCloseButton` variant 변경: CloseButton 미사용 시 header padding 조정 가능
- `hasEntered` 상태 추가: modal prop 변경 시 enter animation 재실행 방지

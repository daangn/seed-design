---
"@seed-design/css": patch
---

Snackbar 영역이 `env(safe-area-inset-*)` 대신 `--seed-safe-area-*` 변수로 좌우·아래 safe area를 피하도록 바꿉니다. 기본 상태에서 보이는 위치는 같습니다. `--seed-safe-area-left`·`--seed-safe-area-right`를 직접 덮어쓰는 앱에서는 Snackbar의 좌우 위치도 그 값을 따릅니다.

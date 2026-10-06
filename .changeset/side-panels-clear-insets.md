---
"@seed-design/css": patch
---

SidePanel이 붙는 쪽의 좌우 safe area를 `env(safe-area-inset-*)` 대신 `--seed-safe-area-*` 변수로 피하도록 바꿉니다. 기본 상태에서 보이는 위치는 같습니다. `maxWidth`를 덮어써 패널의 반대쪽 가장자리가 화면 반대편 inset에 닿으면, 닿는 만큼 헤더·본문·푸터와 닫기 버튼이 안쪽으로 들어옵니다. 배경과 Backdrop은 계속 화면 끝까지 채웁니다.

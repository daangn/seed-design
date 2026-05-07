---
"@seed-design/css": patch
---

`@seed-design/stackflow` v1.1.22 이상 (또는 dev 라인 v1.2.11 이상)의 WAAPI 기반 AppScreen 전환 코드와 호환되도록 transition CSS animation selector를 제거하고 AppBar background slot 스타일을 추가합니다. (PR #1444 백포팅)

이 css는 `@seed-design/stackflow` v1.1.16 ~ v1.1.21 범위와 함께 사용하면 화면 전환 애니메이션 / AppBar 배경이 깨질 수 있으니, stackflow 패키지를 함께 v1.1.22 이상으로 업그레이드하세요.

---
"@seed-design/stackflow": patch
---

`@seed-design/css`에 대한 `peerDependencies` 호환 범위를 정확하게 명시합니다.

WAAPI 기반 AppScreen 전환(1.1.21에 도입)은 css 패키지의 transition selector 제거 + AppBar background slot 추가 변경과 짝을 이루어야 정상 동작합니다. 이전 표현(`>=1.1.19`)은 호환되지 않는 구버전 css도 허용하여 잘못된 조합 시 화면 전환 깨짐/AppBar 배경 사라짐 등의 문제가 발생할 수 있었습니다.

새 표현 `>=1.1.25 <1.2.0 || >=1.2.11`은 다음을 보장합니다:

- 1.1 라인: css 1.1.25 이상 (백포팅된 WAAPI-호환 css)
- dev 라인: css 1.2.11 이상 (PR #1444가 머지된 css)
